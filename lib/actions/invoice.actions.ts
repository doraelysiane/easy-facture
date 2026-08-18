'use server'

import { revalidatePath } from 'next/cache'
import { invoicesRepository } from '@/lib/data'
import { Invoice } from '@/lib/data/types'
import { createClient } from '@/utils/supabase/server'

export async function updateInvoiceStatusAction(invoiceId: string, status: Invoice['status']) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non autorisé");

    await invoicesRepository.updateStatus(user.id, invoiceId, status)
    revalidatePath('/factures')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating status:', error)
    return { success: false, error: 'Impossible de mettre à jour le statut' }
  }
}
