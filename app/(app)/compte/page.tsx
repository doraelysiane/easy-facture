'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ComptePage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@izifacture.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Format d'adresse e-mail invalide.")
      return
    }

    // Mock save
    setSuccess("Informations du compte mises à jour avec succès.")
  }

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mon compte</h2>
        <Button variant="destructive" onClick={handleLogout} className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>
      </div>

      <Card className="animate-fade-slide-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
        <CardHeader>
          <CardTitle>Informations de connexion</CardTitle>
          <CardDescription>
            Modifiez votre adresse e-mail et votre mot de passe pour vous connecter à Izifacture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse e-mail</label>
              <Input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau mot de passe</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Laisser vide pour ne pas modifier"
              />
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            {success && <p className="text-sm text-primary font-medium">{success}</p>}

            <div className="flex justify-end pt-4">
              <Button type="submit">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
