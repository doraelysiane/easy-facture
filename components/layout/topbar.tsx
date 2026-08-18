'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/actions/auth.actions'

export function Topbar({ user }: { user?: { fullName: string, email: string } }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    await logoutAction()
    window.location.href = '/login'
  }

  return (
    <header className="flex h-16 items-center border-b bg-card px-6 relative">
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
    </header>
  )
}
