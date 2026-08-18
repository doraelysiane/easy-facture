'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updatePasswordAction } from '@/actions/auth.actions'
import { Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
       setError("Les mots de passe ne correspondent pas.")
       return
    }
    
    setIsSubmitting(true)
    
    const res = await updatePasswordAction(password)
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
        </div>

        <Card className="shadow-lg border-muted">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
            <CardDescription className="pt-2">
              Veuillez définir votre nouveau mot de passe pour accéder à votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmer le mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer et se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
