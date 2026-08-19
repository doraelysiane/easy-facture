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
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-background text-foreground print:h-auto print:min-h-0 print:overflow-visible print:block print:bg-white">
      <div className="hidden md:block print:hidden h-full z-50 shrink-0">
         <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible print:block print:h-auto relative">
        <div className="print:hidden shrink-0">
           <Topbar user={userData} />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 print:p-0 print:overflow-visible print:h-auto print:block animate-fade-slide-up print:[opacity:1_!important] print:[transform:none_!important]">
          {children}
        </main>
      </div>
    </div>
  )
}
