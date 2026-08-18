'use client'

import { useState } from 'react'

export function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex h-16 items-center border-b bg-card px-6 relative">
      <div className="flex-1" />
      <div className="flex items-center gap-4 relative">
        <button 
           className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary hover:bg-primary/30 transition-colors"
           onClick={() => setIsOpen(!isOpen)}
        >
           N
        </button>
        {isOpen && (
           <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
              <div className="px-4 py-2 border-b">
                 <p className="text-sm font-medium">Admin User</p>
                 <p className="text-xs text-muted-foreground">admin@izifacture.com</p>
              </div>
              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted" onClick={() => setIsOpen(false)}>
                 Se déconnecter
              </button>
           </div>
        )}
      </div>
    </header>
  )
}
