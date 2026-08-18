'use client'

import { useEffect, useState } from 'react'
import { getSettingsAction } from '@/lib/actions/settings.actions'
import { formatFCFA } from '@/lib/domain/invoice-calculations'

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En attente',
    cancelled: 'Annulée'
  };
  return labels[status] || 'Brouillon';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'border-slate-400 text-slate-400',
    sent: 'border-blue-600 text-blue-600',
    paid: 'border-green-600 text-green-600',
    overdue: 'border-orange-500 text-orange-500',
    cancelled: 'border-red-600 text-red-600'
  };
  return colors[status] || 'border-slate-400 text-slate-400';
}

export function InvoicePreview({ data }: { data: any }) {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    getSettingsAction().then(res => {
      if (res.success && res.settings) {
        setSettings(res.settings)
      }
    })
  }, [])

  const subtotal = data.lines?.reduce((sum: number, line: any) => sum + ((line.quantity || 0) * (line.unitPrice || 0)), 0) || 0;
  const vatAmount = Math.round(subtotal * ((data.vatRate || 18) / 100));
  const total = subtotal + vatAmount;

  return (
    <div className="relative bg-white p-6 rounded-sm shadow-xl border w-full min-h-[500px] flex flex-col justify-start print:w-full print:h-full print:border-none print:shadow-none print:p-0">
      
      {/* Macaron de statut */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -rotate-[15deg] border-[6px] px-8 py-3 rounded-xl font-black text-5xl opacity-20 pointer-events-none print:opacity-40 z-10 tracking-widest uppercase ${getStatusColor(data.status)}`}>
        {getStatusLabel(data.status)}
      </div>
      <style>{`
        @media print {
          @page { margin: 0; }
          body { padding: 2cm; }
        }
      `}</style>
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">FACTURE</h1>
            <p className="text-sm text-muted-foreground">{data.status === 'draft' || !data.status ? 'Brouillon' : data.invoiceNumber || 'Facture'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">{settings?.companyName || 'Izifacture'}</h2>
            {settings?.phone && <p className="text-sm text-muted-foreground">{settings.phone}</p>}
            {settings?.email && <p className="text-sm text-muted-foreground">{settings.email}</p>}
            {settings?.address && <p className="text-sm text-muted-foreground">{settings.address}</p>}
          </div>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">À :</h2>
            <p>{data.clientName || 'Nom du client'}</p>
            <p className="text-muted-foreground">{data.clientPhone || 'Téléphone'}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Date :</span> {data.issueDate}</p>
            <p><span className="font-semibold">Échéance :</span> {data.dueDate}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="mt-4 mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="text-left py-2 font-semibold">Description</th>
                  <th className="text-right py-2 font-semibold">Qté</th>
                  <th className="text-right py-2 font-semibold">Prix Unit.</th>
                  <th className="text-right py-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.lines?.map((line: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{line.description || 'Description'}</td>
                    <td className="text-right py-2">{line.quantity || 0}</td>
                    <td className="text-right py-2">{formatFCFA(line.unitPrice || 0)}</td>
                    <td className="text-right py-2">{formatFCFA((line.quantity || 0) * (line.unitPrice || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="self-end w-64 space-y-2 mt-8">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatFCFA(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVA ({data.vatRate || 18}%)</span>
          <span>{formatFCFA(vatAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-3">
          <span>Total TTC</span>
          <span className="text-primary">{formatFCFA(total)}</span>
        </div>
      </div>
    </div>
  )
}
