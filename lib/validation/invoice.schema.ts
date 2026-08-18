import { z } from 'zod';

export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(1, 'La quantité doit être au moins 1'),
  unitPrice: z.number().min(0, 'Le prix ne peut pas être négatif'),
});

export const invoiceSchema = z.object({
  clientName: z.string().min(1, 'Le nom du client est requis'),
  clientPhone: z.string().min(1, 'Le numéro de téléphone est requis'),
  issueDate: z.string().min(1, 'La date d\'émission est requise'),
  dueDate: z.string().min(1, 'La date d\'échéance est requise'),
  vatRate: z.number().min(0),
  currency: z.string().default('XOF'),
  notes: z.string().optional(),
  lines: z.array(invoiceLineSchema).min(1, 'Au moins une ligne est requise')
});
