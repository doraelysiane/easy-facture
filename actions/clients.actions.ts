'use server'

import { clientsRepository } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const ORG_ID = 'demo-org-123';

export async function deleteClientAction(id: string) {
  if ((clientsRepository as any).delete) {
     await (clientsRepository as any).delete(ORG_ID, id);
  }
  revalidatePath('/dashboard');
  revalidatePath('/clients');
  return { success: true };
}
