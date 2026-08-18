'use server'

import { revalidatePath } from 'next/cache'
import { settingsRepository } from '@/lib/data'
import { CompanySettings } from '@/lib/data/types'

const ORG_ID = 'demo-org-123';

export async function updateSettingsAction(data: Partial<CompanySettings>) {
  try {
    await settingsRepository.updateSettings(ORG_ID, data)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Impossible de mettre à jour les paramètres' }
  }
}

export async function getSettingsAction() {
  try {
    const settings = await settingsRepository.getSettings(ORG_ID)
    return { success: true, settings }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return { success: false, error: 'Impossible de récupérer les paramètres' }
  }
}
