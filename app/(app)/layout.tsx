import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { createClient } from "@/utils/supabase/server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const userData = user ? {
    fullName: user.user_metadata?.full_name || 'Utilisateur',
    email: user.email || ''
  } : undefined;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-background text-foreground print:h-auto print:overflow-visible print:bg-white">
      <div className="hidden md:block print:hidden h-full z-50">
         <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible relative pb-16 md:pb-0">
        <div className="print:hidden">
           <Topbar user={userData} />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 print:p-0 print:overflow-visible animate-fade-slide-up">
          {children}
        </main>
      </div>
      <div className="block md:hidden print:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-16 safe-area-bottom">
         <Sidebar mobile />
      </div>
    </div>
  )
}
