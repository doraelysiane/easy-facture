import { IClientsRepository, IInvoicesRepository, ISettingsRepository } from '../repository.interface';
import { Client, Invoice, InvoiceLineItem, CompanySettings } from '../types';
import { supabase } from '../../supabase/client';
import { computeInvoiceTotals } from '../../domain/invoice-calculations';

export class SupabaseClientsRepository implements IClientsRepository {
  async findAll(orgId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', orgId);
    
    if (error) throw error;
    
    // Map snake_case to camelCase
    return (data || []).map(row => ({
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      taxId: row.tax_id
    }));
  }
  
  async findById(orgId: string, id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', orgId)
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      taxId: data.tax_id
    };
  }
  
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const id = `c${Date.now()}`;
    const newClient = { ...client, id };
    
    const { error } = await supabase
      .from('clients')
      .insert({
        id: newClient.id,
        organization_id: newClient.organizationId,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        tax_id: newClient.taxId
      });
      
    if (error) throw error;
    return newClient;
  }
  
  async delete(orgId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('organization_id', orgId)
      .eq('id', id);
      
    if (error) throw error;
  }
}

export class SupabaseInvoicesRepository implements IInvoicesRepository {
  async findAll(orgId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId);
      
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      organizationId: row.organization_id,
      clientId: row.client_id,
      invoiceNumber: row.invoice_number,
      status: row.status,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      currency: row.currency,
      subtotalAmount: row.subtotal_amount,
      vatRate: row.vat_rate,
      vatAmount: row.vat_amount,
      totalAmount: row.total_amount,
      amountPaid: row.amount_paid,
      notes: row.notes
    }));
  }
  
  async findById(orgId: string, id: string): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] } | null> {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId)
      .eq('id', id)
      .single();
      
    if (invoiceError) {
      if (invoiceError.code === 'PGRST116') return null;
      throw invoiceError;
    }
    
    const invoice: Invoice = {
      id: invoiceData.id,
      organizationId: invoiceData.organization_id,
      clientId: invoiceData.client_id,
      invoiceNumber: invoiceData.invoice_number,
      status: invoiceData.status,
      issueDate: invoiceData.issue_date,
      dueDate: invoiceData.due_date,
      currency: invoiceData.currency,
      subtotalAmount: invoiceData.subtotal_amount,
      vatRate: invoiceData.vat_rate,
      vatAmount: invoiceData.vat_amount,
      totalAmount: invoiceData.total_amount,
      amountPaid: invoiceData.amount_paid,
      notes: invoiceData.notes
    };
    
    const { data: linesData, error: linesError } = await supabase
      .from('invoice_lines')
      .select('*')
      .eq('invoice_id', id)
      .order('position', { ascending: true });
      
    if (linesError) throw linesError;
    
    const lines: InvoiceLineItem[] = (linesData || []).map(row => ({
      id: row.id,
      invoiceId: row.invoice_id,
      description: row.description,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      lineTotal: row.line_total,
      position: row.position
    }));
    
    return { invoice, lines };
  }
  
  async create(invoice: Omit<Invoice, 'id'>, lines: Omit<InvoiceLineItem, 'id' | 'invoiceId'>[]): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] }> {
    const id = `inv${Date.now()}`;
    const newInvoice: Invoice = { ...invoice, id };
    
    const { subtotal, vatAmount, total } = computeInvoiceTotals(lines, newInvoice.vatRate);
    newInvoice.subtotalAmount = subtotal;
    newInvoice.vatAmount = vatAmount;
    newInvoice.totalAmount = total;
    
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        id: newInvoice.id,
        organization_id: newInvoice.organizationId,
        client_id: newInvoice.clientId,
        invoice_number: newInvoice.invoiceNumber,
        status: newInvoice.status,
        issue_date: newInvoice.issueDate,
        due_date: newInvoice.dueDate,
        currency: newInvoice.currency,
        subtotal_amount: newInvoice.subtotalAmount,
        vat_rate: newInvoice.vatRate,
        vat_amount: newInvoice.vatAmount,
        total_amount: newInvoice.totalAmount,
        amount_paid: newInvoice.amountPaid,
        notes: newInvoice.notes
      });
      
    if (invoiceError) throw invoiceError;
    
    const newLines = lines.map((l, index) => ({
      ...l,
      id: `line${Date.now()}-${index}`,
      invoiceId: id,
      lineTotal: l.quantity * l.unitPrice,
      position: l.position || index
    }));
    
    if (newLines.length > 0) {
      const { error: linesError } = await supabase
        .from('invoice_lines')
        .insert(newLines.map(row => ({
          id: row.id,
          invoice_id: row.invoiceId,
          description: row.description,
          quantity: row.quantity,
          unit_price: row.unitPrice,
          line_total: row.lineTotal,
          position: row.position
        })));
        
      if (linesError) throw linesError;
    }
    
    return { invoice: newInvoice, lines: newLines };
  }
  
  async updateStatus(orgId: string, id: string, status: Invoice['status']): Promise<Invoice> {
    // First get existing
    const existing = await this.findById(orgId, id);
    if (!existing) throw new Error('Invoice not found');
    
    let invoiceNumber = existing.invoice.invoiceNumber;
    if (status === 'sent' && !invoiceNumber) {
        invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    const { error } = await supabase
      .from('invoices')
      .update({ 
         status,
         invoice_number: invoiceNumber
      })
      .eq('organization_id', orgId)
      .eq('id', id);
      
    if (error) throw error;
    
    existing.invoice.status = status;
    existing.invoice.invoiceNumber = invoiceNumber;
    
    return existing.invoice;
  }
  
  async delete(orgId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('organization_id', orgId)
      .eq('id', id);
      
    if (error) throw error;
  }
  
  async getDashboardStats(orgId: string, startDate?: string, endDate?: string) {
    let query = supabase.from('invoices').select('*').eq('organization_id', orgId);
    
    if (startDate && endDate) {
      query = query.gte('issue_date', startDate).lte('issue_date', endDate);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const orgInvoices = data || [];
    
    const months = ['Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
    const revenueByMonth = months.map(m => ({ name: m, total: Math.floor(Math.random() * 500000) + 100000 }));
    
    return {
      totalInvoices: orgInvoices.length,
      totalAmount: orgInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0),
      paidAmount: orgInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + Number(inv.total_amount), 0),
      pendingAmount: orgInvoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + Number(inv.total_amount), 0),
      overdueAmount: orgInvoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + Number(inv.total_amount), 0),
      revenueByMonth,
    };
  }
}

export class SupabaseSettingsRepository implements ISettingsRepository {
  async getSettings(orgId: string): Promise<CompanySettings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('organization_id', orgId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return {
      organizationId: data.organization_id,
      companyName: data.company_name,
      legalName: data.legal_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      taxId: data.tax_id,
      defaultVatRate: data.default_vat_rate,
      currency: data.currency,
      defaultCurrency: data.default_currency
    };
  }

  async updateSettings(orgId: string, settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const existing = await this.getSettings(orgId);
    
    const payload = {
      organization_id: orgId,
      company_name: settings.companyName ?? existing?.companyName ?? 'Mon Entreprise',
      legal_name: settings.legalName ?? existing?.legalName ?? '',
      email: settings.email ?? existing?.email ?? '',
      phone: settings.phone ?? existing?.phone ?? '',
      address: settings.address ?? existing?.address ?? '',
      tax_id: settings.taxId ?? existing?.taxId ?? '',
      default_vat_rate: settings.defaultVatRate ?? existing?.defaultVatRate ?? 18,
      currency: settings.currency ?? existing?.currency ?? 'XOF',
      default_currency: settings.defaultCurrency ?? existing?.defaultCurrency ?? 'XOF'
    };

    if (!existing) {
      const { error } = await supabase.from('settings').insert(payload);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('settings').update(payload).eq('organization_id', orgId);
      if (error) throw error;
    }

    return {
      organizationId: payload.organization_id,
      companyName: payload.company_name,
      legalName: payload.legal_name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      taxId: payload.tax_id,
      defaultVatRate: payload.default_vat_rate,
      currency: payload.currency,
      defaultCurrency: payload.default_currency
    };
  }
}
