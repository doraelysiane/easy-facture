export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface CompanySettings {
  organizationId: string;
  companyName?: string;
  legalName?: string;
  email?: string;
  phone?: string;
  address: string;
  taxId?: string;
  defaultVatRate: number;
  currency?: string;
  defaultCurrency?: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  position: number;
}

export interface Invoice {
  id: string;
  organizationId: string;
  clientId: string;
  invoiceNumber?: string | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotalAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  amountPaid: number;
  notes?: string;
}
