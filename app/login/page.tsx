'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction, forgotPasswordAction } from '@/actions/auth.actions'
import { Modal } from '@/components/ui/modal'
import { CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Login State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

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
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">Facto</h1>
          </Link>
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
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs text-primary hover:underline">
                    Mot de passe oublié ?
                  </button>
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

      <Modal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} className="max-w-md">
        {!forgotSent ? (
          <form onSubmit={async (e) => {
            e.preventDefault()
            setForgotError('')
            setIsForgotSubmitting(true)
            const res = await forgotPasswordAction(forgotEmail)
            setIsForgotSubmitting(false)
            if (res.success) {
              setForgotSent(true)
            } else {
              setForgotError(res.error || "Une erreur est survenue")
            }
          }} className="space-y-6 py-2">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Mot de passe oublié</h2>
              <p className="text-sm text-muted-foreground">
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse e-mail</label>
              <Input 
                type="email" 
                placeholder="nom@entreprise.com" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            {forgotError && <p className="text-sm text-destructive font-medium">{forgotError}</p>}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForgotModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isForgotSubmitting}>
                {isForgotSubmitting ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">E-mail envoyé</h2>
            <p className="text-sm text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation à <br/>
              <span className="font-semibold text-foreground">{forgotEmail}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Veuillez vérifier votre boîte de réception (et vos spams) et cliquer sur le lien pour créer un nouveau mot de passe.
            </p>
            <Button className="mt-6 w-full" onClick={() => {
              setShowForgotModal(false);
              setForgotSent(false);
              setForgotEmail('');
            }}>
              J'ai compris
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
