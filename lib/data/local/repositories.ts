import { IClientsRepository, IInvoicesRepository, ISettingsRepository } from '../repository.interface';
import { Client, Invoice, InvoiceLineItem, CompanySettings } from '../types';
import { localStore } from './store';
import { computeInvoiceTotals } from '../../domain/invoice-calculations';

export class LocalClientsRepository implements IClientsRepository {
  async findAll(orgId: string): Promise<Client[]> {
    return localStore.clients.filter(c => c.organizationId === orgId);
  }
  
  async findById(orgId: string, id: string): Promise<Client | null> {
    return localStore.clients.find(c => c.organizationId === orgId && c.id === id) || null;
  }
  
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: `c${Date.now()}`
    };
    localStore.clients.push(newClient);
    return newClient;
  }
  
  async delete(orgId: string, id: string): Promise<void> {
    const index = localStore.clients.findIndex(c => c.organizationId === orgId && c.id === id);
    if (index > -1) {
      localStore.clients.splice(index, 1);
    }
  }
}

export class LocalInvoicesRepository implements IInvoicesRepository {
  async findAll(orgId: string): Promise<Invoice[]> {
    return localStore.invoices.filter(i => i.organizationId === orgId);
  }
  
  async findById(orgId: string, id: string): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] } | null> {
    const invoice = localStore.invoices.find(i => i.organizationId === orgId && i.id === id);
    if (!invoice) return null;
    const lines = localStore.invoiceLines.filter(l => l.invoiceId === id).sort((a, b) => a.position - b.position);
    return { invoice, lines };
  }
  
  async create(invoice: Omit<Invoice, 'id'>, lines: Omit<InvoiceLineItem, 'id' | 'invoiceId'>[]): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] }> {
    const id = `inv${Date.now()}`;
    const newInvoice: Invoice = { ...invoice, id };
    
    const { subtotal, vatAmount, total } = computeInvoiceTotals(lines, newInvoice.vatRate);
    newInvoice.subtotalAmount = subtotal;
    newInvoice.vatAmount = vatAmount;
    newInvoice.totalAmount = total;
    
    localStore.invoices.push(newInvoice);
    
    const newLines = lines.map((l, index) => ({
      ...l,
      id: `line${Date.now()}-${index}`,
      invoiceId: id
    }));
    localStore.invoiceLines.push(...newLines);
    
    return { invoice: newInvoice, lines: newLines };
  }
  
  async updateStatus(orgId: string, id: string, status: Invoice['status']): Promise<Invoice> {
    const index = localStore.invoices.findIndex(i => i.organizationId === orgId && i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    localStore.invoices[index] = { ...localStore.invoices[index], status };
    if (status === 'sent' && !localStore.invoices[index].invoiceNumber) {
        localStore.invoices[index].invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    }
    return localStore.invoices[index];
  }
  
  async delete(orgId: string, id: string): Promise<void> {
    const index = localStore.invoices.findIndex(i => i.organizationId === orgId && i.id === id);
    if (index > -1) {
      localStore.invoices.splice(index, 1);
      // Clean up lines
      localStore.invoiceLines = localStore.invoiceLines.filter(l => l.invoiceId !== id);
    }
  }
  
  async getDashboardStats(orgId: string, startDate?: string, endDate?: string) {
    let orgInvoices = localStore.invoices.filter(i => i.organizationId === orgId);
    
    if (startDate && endDate) {
      orgInvoices = orgInvoices.filter(i => i.issueDate >= startDate && i.issueDate <= endDate);
    }
    
    const months = ['Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
    const revenueByMonth = months.map(m => ({ name: m, total: Math.floor(Math.random() * 500000) + 100000 }));
    
    return {
      totalInvoices: orgInvoices.length,
      totalAmount: orgInvoices.filter(i => i.status !== 'draft' && i.status !== 'cancelled').reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidAmount: orgInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
      pendingAmount: orgInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0),
      overdueAmount: orgInvoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0),
      revenueByMonth,
    };
  }
}

export class LocalSettingsRepository implements ISettingsRepository {
  async getSettings(orgId: string): Promise<CompanySettings | null> {
    return localStore.settings.find(s => s.organizationId === orgId) || null;
  }

  async updateSettings(orgId: string, settings: Partial<CompanySettings>): Promise<CompanySettings> {
    let index = localStore.settings.findIndex(s => s.organizationId === orgId);
    if (index === -1) {
      const newSettings: CompanySettings = {
        organizationId: orgId,
        companyName: settings.companyName || 'Mon Entreprise',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        taxId: settings.taxId || '',
        defaultCurrency: settings.defaultCurrency || 'XOF',
        defaultVatRate: settings.defaultVatRate || 18,
      };
      localStore.settings.push(newSettings);
      return newSettings;
    }

    localStore.settings[index] = { ...localStore.settings[index], ...settings };
    return localStore.settings[index];
  }
}
