'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { invoiceSchema } from '@/lib/validation/invoice.schema'
import { createInvoiceFromJson, updateInvoiceFromJson } from '@/actions/invoices.actions'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, Send } from 'lucide-react'
import { InvoicePreview } from './invoice-preview'

const MOCK_CLIENTS = [
  { id: 'c1', name: 'BlueHorizon Ltd.' },
  { id: 'c2', name: 'NexaCorp' }
]

interface InvoiceFormProps {
  initialData?: any;
  invoiceId?: string;
  onSuccess?: () => void;
}

export function InvoiceForm({ initialData, invoiceId, onSuccess }: InvoiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAction, setSubmitAction] = useState<'draft' | 'sent'>('draft')
  
  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      clientName: '',
      clientPhone: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      vatRate: 18,
      currency: 'XOF',
      notes: '',
      lines: [{ description: '', quantity: 1, unitPrice: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines'
  })

  const watchLines = form.watch('lines')
  const vatRate = form.watch('vatRate')
  
  const subtotal = watchLines.reduce((sum: number, line: any) => sum + ((line.quantity || 0) * (line.unitPrice || 0)), 0)
  const vatAmount = Math.round(subtotal * (vatRate / 100))
  const total = subtotal + vatAmount

  async function onSubmit(data: any) {
    setIsSubmitting(true)
    let res;
    if (invoiceId) {
      res = await updateInvoiceFromJson(invoiceId, data, submitAction);
    } else {
      res = await createInvoiceFromJson(data, submitAction);
    }
    
    setIsSubmitting(false)
    if (res.success) {
      if (onSuccess) {
         onSuccess();
         router.refresh();
      } else {
         router.push('/factures');
         router.refresh();
      }
    } else {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <div className="print:hidden animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '100ms' }}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="py-3"><CardTitle className="text-lg">Détails de la facture et du client</CardTitle></CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Nom et prénom du client</label>
                    <Input placeholder="Ex: Koffi Kouadio" className="h-8 w-full text-sm" {...form.register('clientName')} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Numéro de téléphone</label>
                    <Input placeholder="Ex: +225 01 02 03 04 05" className="h-8 w-full text-sm" {...form.register('clientPhone')} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Date de facturation</label>
                    <Input type="date" className="h-8 w-full text-sm" {...form.register('issueDate')} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Date d'échéance</label>
                    <Input type="date" className="h-8 w-full text-sm" {...form.register('dueDate')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="py-3"><CardTitle className="text-lg">Lignes de facturation</CardTitle></CardHeader>
            <CardContent className="space-y-2 pb-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Input placeholder="Description du service..." className="h-8 text-sm" {...form.register(`lines.${index}.description` as const)} />
                  </div>
                  <div className="w-16 space-y-1">
                    <Input type="number" placeholder="Qté" className="h-8 text-sm px-2" {...form.register(`lines.${index}.quantity` as const, { valueAsNumber: true })} />
                  </div>
                  <div className="w-24 space-y-1">
                    <Input type="number" placeholder="Prix" className="h-8 text-sm px-2" {...form.register(`lines.${index}.unitPrice` as const, { valueAsNumber: true })} />
                  </div>
                  <div className="w-24 py-1.5 text-right font-medium text-sm">
                    {((watchLines[index]?.quantity || 0) * (watchLines[index]?.unitPrice || 0)).toLocaleString()}
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-0 shrink-0" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2 h-8 text-xs" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                <Plus className="mr-2 h-3 w-3" /> Ajouter une ligne
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-right p-3 rounded-md bg-muted/30 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span>{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA ({vatRate}%)</span>
                <span>{vatAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total TTC</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
      
      <div className="flex justify-end pt-2 gap-2">
         <Button 
            type="submit" 
            variant="secondary" 
            disabled={isSubmitting}
            onClick={() => setSubmitAction('draft')}
         >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer comme brouillon
         </Button>
         <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setSubmitAction('sent')}
         >
            <Send className="w-4 h-4 mr-2" />
            Enregistrer et envoyer
         </Button>
      </div>
    </form>
  </div>
      
      <div className="flex flex-col md:sticky md:top-4 bg-slate-50/50 p-2 md:p-4 rounded-lg border items-center justify-start print:block print:p-0 print:border-none print:bg-transparent overflow-hidden max-h-[90vh] animate-fade-slide-up transition-all duration-300 hover:shadow-xl hover:bg-slate-100/50" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '300ms' }}>
        <div className="w-full flex justify-end mb-2 print:hidden">
           {form.watch('status') === 'paid' ? (
             <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
                Télécharger en PDF
             </Button>
           ) : (
             <div className="text-xs text-muted-foreground text-right w-full">
                * Téléchargement dispo. après paiement
             </div>
           )}
        </div>
        <div className="w-full overflow-y-auto pb-4 origin-top" style={{ zoom: 0.85 }}>
           <InvoicePreview data={form.watch()} />
        </div>
      </div>
    </div>
  )
}
