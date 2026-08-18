'use server'

import { localStore } from '@/lib/data/local/store'

export async function registerAction(data: any) {
  const { email, password, companyName } = data
  
  // Check if user exists
  const existingUser = localStore.users.find(u => u.email === email)
  if (existingUser) {
    return { success: false, error: "Un compte avec cette adresse email existe déjà." }
  }

  // Create unverified user
  const newUser = {
    id: `u${Date.now()}`,
    email,
    password, // In a real app, hash this!
    companyName,
    isVerified: false
  }
  
  localStore.users.push(newUser)
  return { success: true }
}

export async function verifyEmailAction(email: string) {
  const user = localStore.users.find(u => u.email === email)
  if (!user) {
    return { success: false, error: "Utilisateur non trouvé." }
  }

  user.isVerified = true
  return { success: true }
}

export async function loginAction(data: any) {
  const { email, password } = data
  
  const user = localStore.users.find(u => u.email === email)
  
  if (!user) {
    return { success: false, error: "Adresse email ou mot de passe incorrect." }
  }

  if (user.password !== password) {
    return { success: false, error: "Adresse email ou mot de passe incorrect." }
  }

  if (!user.isVerified) {
    return { success: false, error: "Veuillez vérifier votre adresse email avant de vous connecter." }
  }

  return { success: true, user: { id: user.id, email: user.email, companyName: user.companyName } }
}
