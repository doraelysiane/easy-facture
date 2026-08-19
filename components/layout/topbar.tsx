'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/actions/auth.actions'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

export function Topbar({ user }: { user?: { fullName: string, email: string } }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const confirmLogout = async () => {
    await logoutAction()
    window.location.href = '/login'
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 relative">
      <div className="flex items-center md:hidden">
         <button onClick={() => setShowMobileMenu(true)} className="p-2 -ml-2 text-foreground">
            <Menu className="w-6 h-6" />
         </button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-4 text-sm font-medium">
          <button onClick={() => setShowLogoutModal(true)} className="text-red-600 hover:text-red-800 hover:underline transition-all">
             Déconnexion
          </button>
        </div>
      </div>

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} className="max-w-md">
        <div className="text-center space-y-4 py-4">
          <h2 className="text-xl font-bold">Déconnexion</h2>
          <p className="text-muted-foreground">Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Oui, se déconnecter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
         <div className="fixed inset-0 z-[100] md:hidden">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowMobileMenu(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl transition-transform transform translate-x-0 flex flex-col h-full">
               <button onClick={() => setShowMobileMenu(false)} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-10 bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
               </button>
               <Sidebar className="w-full border-none shadow-none" onNavigate={() => setShowMobileMenu(false)} />
            </div>
         </div>
      )}
    </header>
  )
}
