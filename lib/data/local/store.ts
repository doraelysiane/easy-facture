import { Client, Invoice, InvoiceLineItem, CompanySettings } from '../types';

export const DEMO_ORG_ID = 'demo-org-123';

export const localStore = {
  settings: [
    {
      organizationId: DEMO_ORG_ID,
      legalName: 'Izifacture Demo',
      address: 'Abidjan, Côte d\'Ivoire',
      defaultVatRate: 18.00,
      currency: 'XOF',
    }
  ] as CompanySettings[],
  users: [
    {
      id: 'u-demo',
      email: 'admin@izifacture.com',
      password: 'admin',
      companyName: 'Izifacture Demo',
      isVerified: true
    }
  ] as any[],
  clients: [
    {
      id: 'c1',
      organizationId: DEMO_ORG_ID,
      name: 'Koffi Kouadio',
      email: 'koffi.k@example.ci',
      phone: '+225 01 02 03 04 05',
      address: 'Cocody, Abidjan, Côte d\'Ivoire'
    },
    {
      id: 'c2',
      organizationId: DEMO_ORG_ID,
      name: 'Ama Konan',
      email: 'ama.konan@example.ci',
      phone: '+225 07 08 09 10 11',
      address: 'Marcory, Abidjan, Côte d\'Ivoire'
    }
  ] as Client[],
  invoices: [
    {
      id: 'inv-1',
      organizationId: DEMO_ORG_ID,
      clientId: 'c1',
      invoiceNumber: 'INV-2026-001',
      issueDate: '2026-08-10',
      dueDate: '2026-08-25',
      status: 'paid',
      subtotal: 169000,
      taxAmount: 0,
      totalAmount: 169000,
      notes: 'Merci pour votre confiance.',
      lines: []
    },
    {
      id: 'inv-2',
      organizationId: DEMO_ORG_ID,
      clientId: 'c2',
      invoiceNumber: 'INV-2026-002',
      issueDate: '2026-08-15',
      dueDate: '2026-08-30',
      status: 'sent',
      subtotal: 95000,
      taxAmount: 0,
      totalAmount: 95000,
      notes: 'Paiement à réception.',
      lines: []
    },
    {
      id: 'inv-3',
      organizationId: DEMO_ORG_ID,
      clientId: 'c1',
      invoiceNumber: 'INV-2026-003',
      issueDate: '2026-07-01',
      dueDate: '2026-07-15',
      status: 'sent', // Sera calculé comme "en retard" car la date d'échéance est passée
      subtotal: 45000,
      taxAmount: 0,
      totalAmount: 45000,
      notes: 'Facture en retard.',
      lines: []
    },
    {
      id: 'inv-4',
      organizationId: DEMO_ORG_ID,
      clientId: 'c2',
      invoiceNumber: '',
      issueDate: '2026-08-17',
      dueDate: '2026-08-31',
      status: 'draft',
      subtotal: 120000,
      taxAmount: 0,
      totalAmount: 120000,
      notes: 'Brouillon en cours.',
      lines: []
    }
  ] as Invoice[],
  invoiceLines: [
    {
      id: 'line1',
      invoiceId: 'inv1',
      description: 'Consulting',
      quantity: 1,
      unitPrice: 143220,
      lineTotal: 143220,
      position: 1
    },
    {
      id: 'line2',
      invoiceId: 'inv2',
      description: 'Design Services',
      quantity: 1,
      unitPrice: 80508,
      lineTotal: 80508,
      position: 1
    }
  ] as InvoiceLineItem[]
};
