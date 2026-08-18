'use client'

import { useEffect, useState } from 'react'
import { getSettingsAction } from '@/lib/actions/settings.actions'
import { formatFCFA } from '@/lib/domain/invoice-calculations'

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard',
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
    <div id="invoice-print-area" className="relative bg-white p-6 md:p-10 rounded-sm shadow-xl border w-full min-h-[500px] flex flex-col justify-start">
      
      {/* Macaron de statut */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -rotate-[15deg] border-[6px] px-8 py-3 rounded-xl font-black text-5xl opacity-10 pointer-events-none print:opacity-30 z-10 tracking-widest uppercase ${getStatusColor(data.status)}`}>
        {getStatusLabel(data.status)}
      </div>

      <style>{`
        @media print {
          @page { 
            margin: 1cm; 
            size: A4 portrait;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          /* Remove visibility and absolute positioning hacks to fix the blank page issue */
          #invoice-print-area {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      
      <div>
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-primary mb-2 tracking-tight">FACTURE</h1>
            <p className="text-lg text-slate-500 font-medium">{data.status === 'draft' || !data.status ? 'Brouillon' : data.invoiceNumber || 'Facture'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-slate-900">{settings?.companyName || 'Izifacture'}</h2>
            {settings?.phone && <p className="text-slate-600 mt-1">{settings.phone}</p>}
            {settings?.email && <p className="text-slate-600">{settings.email}</p>}
            {settings?.address && <p className="text-slate-600">{settings.address}</p>}
          </div>
        </div>

        <div className="flex justify-between items-start mb-10 bg-slate-50 p-6 rounded-lg print:bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Facturé à</h2>
            <p className="text-xl font-bold text-slate-900">{data.clientName || 'Nom du client'}</p>
            <p className="text-slate-600 mt-1">{data.clientPhone || 'Téléphone'}</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Date d'émission</p>
              <p className="font-semibold text-slate-900">{data.issueDate}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-3">Date d'échéance</p>
              <p className="font-semibold text-slate-900">{data.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-3 px-2 font-bold text-slate-800">Description</th>
                  <th className="text-center py-3 px-2 font-bold text-slate-800 w-24">Qté</th>
                  <th className="text-right py-3 px-2 font-bold text-slate-800 w-32">Prix Unit.</th>
                  <th className="text-right py-3 px-2 font-bold text-slate-800 w-32">Total</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {data.lines?.map((line: any, i: number) => (
                  <tr key={i} className="border-b border-slate-200 last:border-b-0">
                    <td className="py-4 px-2 font-medium">{line.description || 'Description'}</td>
                    <td className="text-center py-4 px-2">{line.quantity || 0}</td>
                    <td className="text-right py-4 px-2">{formatFCFA(line.unitPrice || 0)}</td>
                    <td className="text-right py-4 px-2 font-semibold text-slate-900">{formatFCFA((line.quantity || 0) * (line.unitPrice || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="self-end w-80 space-y-3 mt-8 bg-slate-50 p-6 rounded-lg print:bg-slate-50">
        <div className="flex justify-between text-slate-600">
          <span>Sous-total</span>
          <span className="font-medium">{formatFCFA(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>TVA ({data.vatRate || 18}%)</span>
          <span className="font-medium">{formatFCFA(vatAmount)}</span>
        </div>
        <div className="flex justify-between font-black text-2xl border-t-2 border-slate-800 pt-4 mt-2 text-slate-900">
          <span>Total TTC</span>
          <span className="text-primary">{formatFCFA(total)}</span>
        </div>
      </div>
    </div>
  )
}
