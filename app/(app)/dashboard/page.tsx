import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { invoicesRepository } from "@/lib/data"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import Link from "next/link"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { createClient } from "@/utils/supabase/server"
import { Plus } from "lucide-react"

export default async function DashboardPage(props: { searchParams: Promise<{ startDate?: string, endDate?: string }> }) {
  const searchParams = await props.searchParams;
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const orgId = user?.id || 'demo-org-123';
  const fullName = user?.user_metadata?.full_name || 'Admin'

  const stats = await invoicesRepository.getDashboardStats(orgId, searchParams.startDate, searchParams.endDate);
  
  let chartData = stats.revenueByMonth.map(m => ({ label: m.name, total: m.total }));
  let chartTitle = "Chiffre d'affaires (6 derniers mois)";

  if (searchParams.startDate && searchParams.endDate) {
     chartTitle = `Chiffre d'affaires (Du ${searchParams.startDate} au ${searchParams.endDate})`;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Hello, {fullName}</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card className="shadow-md border-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFCFA(stats.totalAmount)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatFCFA(stats.paidAmount)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatFCFA(stats.pendingAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '400ms' }}>
        <div className="space-y-6">
           <Card className="min-h-[300px] shadow-md border-muted">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <CardTitle>{chartTitle}</CardTitle>
                 <div className="w-full md:w-auto">
                    <DashboardFilters initialStart={searchParams.startDate} initialEnd={searchParams.endDate} />
                 </div>
              </CardHeader>
              <CardContent>
                 <RevenueChart data={chartData} />
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
