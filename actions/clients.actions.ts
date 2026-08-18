'use server'

import { clientsRepository } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createClientAction(data: { name: string, email?: string, phone?: string, address?: string, taxId?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non autorisé" };
  
  try {
    const newClient = await clientsRepository.create({
      organizationId: user.id,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      taxId: data.taxId || ''
    });
    
    revalidatePath('/clients');
    return { success: true, clientId: newClient.id };
  } catch (error: any) {
    console.error("Erreur création client :", error);
    return { success: false, error: error.message || "Erreur serveur" };
  }
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non autorisé" };

  if ((clientsRepository as any).delete) {
     await (clientsRepository as any).delete(user.id, id);
  }
  revalidatePath('/dashboard');
  revalidatePath('/clients');
  return { success: true };
}
