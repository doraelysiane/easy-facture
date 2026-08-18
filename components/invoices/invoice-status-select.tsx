'use client'

import { useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { updateInvoiceStatusAction } from '@/lib/actions/invoice.actions'
import { Invoice } from '@/lib/data/types'
import { ChevronDown, Loader2 } from 'lucide-react'

export function InvoiceStatusSelect({ invoiceId, initialStatus }: { invoiceId: string, initialStatus: Invoice['status'] }) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Invoice['status'];
    if (newStatus !== initialStatus) {
      startTransition(async () => {
        await updateInvoiceStatusAction(invoiceId, newStatus);
      });
    }
  }

  const getVariant = (s: string) => {
    if (s === 'paid') return 'success';
    if (s === 'overdue') return 'destructive';
    if (s === 'sent') return 'warning';
    if (s === 'draft') return 'secondary';
    return 'default';
  }

  return (
    <div className="relative inline-block w-full max-w-[120px]">
      <select
        value={initialStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className={`w-full appearance-none absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10 h-full`}
      >
        <option value="draft">Brouillon</option>
        <option value="sent">Envoyé</option>
        <option value="paid">Payé</option>
        <option value="overdue">En retard</option>
        <option value="cancelled">Annulée</option>
      </select>
      
      <Badge variant={getVariant(initialStatus) as any} className="w-full flex justify-between items-center pointer-events-none relative z-0 h-[22px]">
        <span>
          {initialStatus === 'draft' && 'Brouillon'}
          {initialStatus === 'sent' && 'Envoyé'}
          {initialStatus === 'paid' && 'Payé'}
          {initialStatus === 'overdue' && 'En retard'}
          {initialStatus === 'cancelled' && 'Annulée'}
        </span>
        {isPending ? (
           <Loader2 className="h-3 w-3 ml-1 animate-spin shrink-0" />
        ) : (
           <ChevronDown className="h-3 w-3 ml-1 opacity-50 shrink-0" />
        )}
      </Badge>
    </div>
  )
}
