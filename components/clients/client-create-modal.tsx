'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClientAction } from '@/actions/clients.actions'
import { toast } from '@/components/ui/use-toast'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ClientCreateModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    taxId: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast({ title: "Erreur", description: "Le nom est obligatoire", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    const res = await createClientAction(formData)
    setIsSubmitting(false)

    if (res.success) {
      toast({ title: "Succès", description: "Le client a été créé avec succès." })
      setIsOpen(false)
      setFormData({ name: '', phone: '', email: '', address: '', taxId: '' })
      router.refresh()
    } else {
      toast({ title: "Erreur", description: res.error || "Une erreur est survenue.", variant: "destructive" })
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Créer un client</span>
        <span className="inline sm:hidden">Créer</span>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-bold">Créer un nouveau client</h2>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-semibold">Nom du client / Entreprise <span className="text-red-500">*</span></label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Jean Dupont" required />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-semibold">Numéro de téléphone</label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ex: +225 0102030405" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold">Email</label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jean@exemple.com" />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-xs font-semibold">Adresse postale</label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Abidjan, Cocody..." />
          </div>

          <div className="space-y-2">
            <label htmlFor="taxId" className="text-xs font-semibold">Numéro d'Identification Fiscale (NIF)</label>
            <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Optionnel" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
