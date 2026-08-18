'use client'

import { useState } from 'react'
import { Eye, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'

import { Trash2 } from 'lucide-react'
import { deleteInvoiceAction } from '@/actions/invoices.actions'

export function InvoiceActions({ invoice }: { invoice: any }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteInvoiceAction(invoice.id);
    setIsDeleting(false);
    setDeleteOpen(false);
  }

  return (
    <>
      <div className="flex justify-end gap-2 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => setViewOpen(true)}>
          <Eye className="h-5 w-5" />
        </Button>
        {invoice.status !== 'paid' && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" onClick={() => setEditOpen(true)}>
            <Edit className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-70 hover:opacity-100" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-5 w-5" />
        </Button>
        {invoice.status === 'sent' && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
             <CheckCircle className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} className="max-w-4xl bg-slate-100/50">
        <div className="w-full flex justify-end mb-4 print:hidden">
           {invoice.status === 'paid' ? (
             <Button type="button" onClick={() => window.print()}>
                Télécharger en PDF (Imprimer)
             </Button>
           ) : (
             <div className="text-sm text-muted-foreground flex items-center bg-slate-200 px-3 py-1.5 rounded-md">
               Seules les factures payées peuvent être téléchargées.
             </div>
           )}
        </div>
        <InvoicePreview data={invoice} />
      </Modal>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} className="max-w-[90vw] lg:max-w-7xl">
        <div className="mb-6 border-b pb-4">
           <h2 className="text-3xl font-bold tracking-tight">Modifier la facture</h2>
        </div>
        <InvoiceForm 
           initialData={invoice} 
           invoiceId={invoice.id} 
           onSuccess={() => setEditOpen(false)} 
        />
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} className="max-w-md h-auto p-2">
        <div className="p-4 space-y-4 text-center">
          <h3 className="text-xl font-bold">Supprimer la facture</h3>
          <p className="text-muted-foreground text-sm">
            Êtes-vous sûr de vouloir supprimer la facture <strong>{invoice.invoiceNumber || invoice.id}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
