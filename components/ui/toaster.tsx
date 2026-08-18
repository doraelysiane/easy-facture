'use client'

import { useToast } from './use-toast'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 bg-white border shadow-xl rounded-xl p-4 min-w-[300px] animate-fade-slide-up" style={{ animationDuration: '0.3s' }}>
           {t.variant === 'success' && <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />}
           {t.variant === 'destructive' && <XCircle className="text-red-500 w-6 h-6 shrink-0" />}
           {(!t.variant || t.variant === 'default') && <AlertCircle className="text-blue-500 w-6 h-6 shrink-0" />}
           <div>
             <h4 className="text-sm font-semibold">{t.title}</h4>
             {t.description && <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>}
           </div>
        </div>
      ))}
    </div>
  )
}
