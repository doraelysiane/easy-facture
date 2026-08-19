'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, Plus, HelpCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Sidebar({ className, onNavigate }: { className?: string, onNavigate?: () => void }) {
  const pathname = usePathname()

  const allLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/factures/nouvelle', label: 'Créer', icon: Plus },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/factures', label: 'Factures', icon: FileText },
    { href: '/parametres', label: 'Paramètres', icon: Settings },
    { href: '/aide', label: 'Aide et support', icon: HelpCircle },
    { href: '/compte', label: 'Mon compte', icon: User },
  ]

  // Removed old mobile logic

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      <div className="p-6 pb-8">
        <h1 className="text-2xl font-bold text-primary">Facto</h1>
      </div>
      <nav className="flex-1 space-y-3 px-4 flex flex-col overflow-y-auto pb-4">
        <div>
          {allLinks.map((link) => {
            let isActive = false;
            if (link.href === '/factures') {
               isActive = pathname === '/factures' || (pathname.startsWith('/factures/') && !pathname.includes('nouvelle'));
            } else if (link.href === '/dashboard') {
               isActive = pathname === '/dashboard';
            } else {
               isActive = pathname.startsWith(link.href);
            }
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onNavigate && onNavigate()}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all mb-3",
                  isActive 
                    ? "border-2 border-black text-black shadow-sm bg-slate-50/50" 
                    : "border-2 border-transparent text-slate-500 hover:text-black"
                )}
              >
                <Icon className="h-5 w-5" /> {link.label === 'Créer' ? 'Créer une facture' : link.label === 'Dashboard' ? 'Tableau de bord' : link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
