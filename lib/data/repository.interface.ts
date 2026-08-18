import { Client, Invoice, InvoiceLineItem, CompanySettings } from './types';

export interface IClientsRepository {
  findAll(orgId: string): Promise<Client[]>;
  findById(orgId: string, id: string): Promise<Client | null>;
  create(client: Omit<Client, 'id'>): Promise<Client>;
}

export interface IInvoicesRepository {
  findAll(orgId: string): Promise<Invoice[]>;
  findById(orgId: string, id: string): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] } | null>;
  create(invoice: Omit<Invoice, 'id'>, lines: Omit<InvoiceLineItem, 'id' | 'invoiceId'>[]): Promise<{ invoice: Invoice; lines: InvoiceLineItem[] }>;
  updateStatus(orgId: string, id: string, status: Invoice['status']): Promise<Invoice>;
  getDashboardStats(orgId: string, startDate?: string, endDate?: string): Promise<{
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    revenueByMonth: { name: string; total: number }[];
  }>;
}

export interface ISettingsRepository {
  getSettings(orgId: string): Promise<CompanySettings | null>;
  updateSettings(orgId: string, settings: Partial<CompanySettings>): Promise<CompanySettings>;
}
