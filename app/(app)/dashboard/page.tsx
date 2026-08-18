import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { invoicesRepository } from "@/lib/data"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import Link from "next/link"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { Plus } from "lucide-react"

const ORG_ID = 'demo-org-123';

export default async function DashboardPage(props: { searchParams: Promise<{ startDate?: string, endDate?: string }> }) {
  const searchParams = await props.searchParams;
  const stats = await invoicesRepository.getDashboardStats(ORG_ID, searchParams.startDate, searchParams.endDate);
  
  // Logic to simulate dynamic chart data based on selected dates
  let chartData: { label: string, total: number }[] = [];
  let chartTitle = "Chiffre d'affaires (Aujourd'hui)";

  if (searchParams.startDate && searchParams.endDate) {
     chartTitle = `Chiffre d'affaires (Du ${searchParams.startDate} au ${searchParams.endDate})`;
     // Generate some dummy data points to simulate the selected period (daily)
     chartData = [
       { label: 'Jour 1', total: Math.floor(Math.random() * 50000) + 10000 },
       { label: 'Jour 2', total: Math.floor(Math.random() * 70000) + 20000 },
       { label: 'Jour 3', total: Math.floor(Math.random() * 60000) + 15000 },
       { label: 'Jour 4', total: Math.floor(Math.random() * 90000) + 30000 },
       { label: 'Jour 5', total: Math.floor(Math.random() * 80000) + 25000 },
     ];
  } else {
     // Default data: Today's hourly progression up to 16:00
     chartData = [
       { label: '08:00', total: 0 },
       { label: '10:00', total: 15000 },
       { label: '12:00', total: 45000 },
       { label: '14:00', total: 60000 },
       { label: '16:00', total: 85000 },
     ];
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Bonjour, Admin</h2>
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
