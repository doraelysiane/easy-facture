'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkRateLimit } from '@/lib/rate-limit'

export async function registerAction(data: any) {
  const rateLimit = await checkRateLimit('register', 3, 3600000); // 3 requêtes par heure maximum
  if (!rateLimit.success) return rateLimit;

  const { email, password, fullName } = data
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function loginAction(data: any) {
  const rateLimit = await checkRateLimit('login', 5, 60000); // 5 tentatives par minute
  if (!rateLimit.success) return rateLimit;

  const { email, password } = data
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: "Adresse email ou mot de passe incorrect, ou email non vérifié." }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function forgotPasswordAction(email: string) {
  const rateLimit = await checkRateLimit('forgot_password', 3, 300000); // 3 demandes toutes les 5 minutes
  if (!rateLimit.success) return rateLimit;

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updatePasswordAction(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
