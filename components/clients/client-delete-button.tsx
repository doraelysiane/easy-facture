'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { deleteClientAction } from '@/actions/clients.actions'

export function ClientDeleteButton({ id, clientName }: { id: string, clientName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteClientAction(id)
    setIsDeleting(false)
    setIsOpen(false)
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground hover:text-destructive transition-colors"
        onClick={(e) => {
           e.stopPropagation()
           setIsOpen(true)
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-md h-auto p-2">
        <div className="p-4 space-y-4 text-center">
          <h3 className="text-xl font-bold">Supprimer le client</h3>
          <p className="text-muted-foreground text-sm">
            Êtes-vous sûr de vouloir supprimer <strong>{clientName}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
