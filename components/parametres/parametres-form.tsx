'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building2, CreditCard, Loader2 } from "lucide-react"
import { CompanySettings } from '@/lib/data/types'
import { updateSettingsAction } from '@/lib/actions/settings.actions'

export function ParametresForm({ settings }: { settings: CompanySettings | null }) {
  const [activeTab, setActiveTab] = useState<'profil' | 'facturation'>('profil')
  const [isPending, startTransition] = useTransition()

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateSettingsAction({
        companyName: formData.get('companyName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        taxId: formData.get('taxId') as string,
      })
      alert("Profil mis à jour avec succès !")
    })
  }

  async function handleFacturationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateSettingsAction({
        defaultCurrency: formData.get('defaultCurrency') as string,
        defaultVatRate: Number(formData.get('defaultVatRate')),
      })
      alert("Préférences mises à jour avec succès !")
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1 space-y-4">
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 scrollbar-hide">
           <Button 
             variant={activeTab === 'profil' ? 'secondary' : 'ghost'} 
             className={`justify-start whitespace-nowrap ${activeTab !== 'profil' ? 'text-muted-foreground hover:text-foreground' : ''}`}
             onClick={() => setActiveTab('profil')}
           >
             <Building2 className="mr-2 h-4 w-4 shrink-0" /> Profil de l'entreprise
           </Button>
           <Button 
             variant={activeTab === 'facturation' ? 'secondary' : 'ghost'} 
             className={`justify-start whitespace-nowrap ${activeTab !== 'facturation' ? 'text-muted-foreground hover:text-foreground' : ''}`}
             onClick={() => setActiveTab('facturation')}
           >
             <CreditCard className="mr-2 h-4 w-4 shrink-0" /> Facturation
           </Button>
        </nav>
      </div>
      
      <div className="col-span-1 md:col-span-3 space-y-6">
        {activeTab === 'profil' ? (
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profil de l'entreprise</CardTitle>
                <CardDescription>Ces informations seront affichées sur vos factures envoyées aux clients.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'entreprise</label>
                  <Input name="companyName" defaultValue={settings?.companyName || "Izifacture Demo"} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email professionnel</label>
                    <Input type="email" name="email" defaultValue={settings?.email || "contact@izifacture.com"} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Téléphone</label>
                    <Input type="tel" name="phone" defaultValue={settings?.phone || "+225 01 02 03 04 05"} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse complète</label>
                  <Input name="address" defaultValue={settings?.address || "Plateau, Abidjan, Côte d'Ivoire"} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Numéro d'Identification Fiscale (NIF)</label>
                  <Input name="taxId" defaultValue={settings?.taxId || "CI-123456789-Z"} />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer le profil
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleFacturationSubmit}>
              <CardHeader>
                <CardTitle>Facturation et Devise</CardTitle>
                <CardDescription>Configurez vos préférences pour les montants et la TVA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Devise par défaut</label>
                    <select name="defaultCurrency" defaultValue={settings?.defaultCurrency || "XOF"} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                       <option value="XOF">XOF (Franc CFA BCEAO)</option>
                       <option value="XAF">XAF (Franc CFA CEMAC)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taux de TVA par défaut (%)</label>
                    <Input type="number" name="defaultVatRate" defaultValue={settings?.defaultVatRate || 18} />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Conditions de paiement par défaut</label>
                   <Input defaultValue="Paiement à réception" disabled />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer les préférences
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
