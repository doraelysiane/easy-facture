'use server'

import { revalidatePath } from 'next/cache'
import { invoicesRepository } from '@/lib/data'
import { Invoice } from '@/lib/data/types'

const ORG_ID = 'demo-org-123';

export async function updateInvoiceStatusAction(invoiceId: string, status: Invoice['status']) {
  try {
    await invoicesRepository.updateStatus(ORG_ID, invoiceId, status)
    revalidatePath('/', 'layout') 
    return { success: true }
  } catch (error) {
    console.error('Error updating status:', error)
    return { success: false, error: 'Impossible de mettre à jour le statut' }
  }
}
