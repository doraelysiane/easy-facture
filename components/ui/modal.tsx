'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, children, className = '' }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
     setMounted(true);
     if (isOpen) {
        document.body.style.overflow = 'hidden';
     } else {
        document.body.style.overflow = 'unset';
     }
     return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);
  
  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className={`relative w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] ${className}`}>
        <button 
           onClick={onClose}
           className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 overflow-y-auto w-full h-full p-2 sm:p-6 print:p-0">
          {children}
        </div>
      </div>
    </div>
  )
}
