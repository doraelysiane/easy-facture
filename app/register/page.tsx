'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerAction } from '@/actions/auth.actions'
import { Mail } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const res = await registerAction({ email, password, fullName })
    setIsSubmitting(false)
    
    if (res.success) {
      setNeedsVerification(true)
    } else {
      setError(res.error || "Une erreur est survenue")
    }
  }

  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-muted animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Vérifiez votre e-mail</CardTitle>
            <CardDescription className="pt-2">
              Nous avons envoyé un lien de confirmation à <br/>
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Veuillez cliquer sur le lien dans cet e-mail pour activer votre compte. Vous ne pourrez pas vous connecter avant cette étape.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Aller à la page de connexion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Izifacture</h1>
          <p className="text-muted-foreground">Créez votre compte en quelques secondes.</p>
        </div>

        <Card className="shadow-lg border-muted">
          <CardHeader>
            <CardTitle className="text-2xl">Inscription</CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous pour démarrer avec Izifacture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prénom et Nom</label>
                <Input 
                  type="text" 
                  placeholder="Ex: Jean Dupont" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
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
                <label className="text-sm font-medium">Mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer mon compte"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
