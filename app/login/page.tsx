'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction } from '@/actions/auth.actions'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const res = await loginAction({ email, password })
    setIsSubmitting(false)
    
    if (res.success) {
      router.push('/dashboard')
    } else {
      setError(res.error || "Une erreur est survenue")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Izifacture</h1>
          <p className="text-muted-foreground">Bienvenue ! Connectez-vous à votre compte.</p>
        </div>

        <Card className="shadow-lg border-muted">
          <CardHeader>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre tableau de bord.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse e-mail</label>
                <Input 
                  type="email" 
                  placeholder="nom@entreprise.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Vous n'avez pas de compte ?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline transition-all">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
