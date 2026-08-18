import { invoicesRepository, clientsRepository } from "@/lib/data"
import { createClient } from "@/utils/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Edit, CheckCircle, ChevronDown } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

import { InvoiceActions } from "@/components/invoices/invoice-actions"
import { InvoiceStatusSelect } from "@/components/invoices/invoice-status-select"

const ORG_ID = 'demo-org-123';

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    paid: 'Payé',
    overdue: 'En attente',
    cancelled: 'Annulée'
  };
  return labels[status] || status;
};

export default async function FacturesPage(props: { searchParams: Promise<{ q?: string, status?: string, sort?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const orgId = user?.id || 'demo-org-123';

  const searchParams = await props.searchParams;
  let rawInvoices = await invoicesRepository.findAll(orgId);
  const clients = await clientsRepository.findAll(orgId);
  
  // Sort clients alphabetically for the datalist
  const sortedClients = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Inconnu';
  const getClientPhone = (id: string) => clients.find(c => c.id === id)?.phone || '';

  let invoices = rawInvoices.map(inv => {
     const enriched = { 
       ...inv, 
       clientName: getClientName(inv.clientId), 
       clientPhone: getClientPhone(inv.clientId) 
     };
     if (enriched.status !== 'paid' && new Date(enriched.dueDate).getTime() < new Date().getTime()) {
        enriched.status = 'overdue';
     }
     return enriched;
  });

  const q = searchParams.q?.toLowerCase();
  if (q) {
    invoices = invoices.filter(inv => 
      inv.invoiceNumber?.toLowerCase().includes(q) || 
      getClientName(inv.clientId).toLowerCase().includes(q)
    );
  }

  const statusFilter = searchParams.status;
  if (statusFilter && statusFilter !== 'all') {
    invoices = invoices.filter(inv => inv.status === statusFilter);
  }

  const sort = searchParams.sort || 'date_desc';
  invoices.sort((a, b) => {
     if (sort === 'date_desc') return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
     if (sort === 'date_asc') return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
     if (sort === 'amount_desc') return b.totalAmount - a.totalAmount;
     if (sort === 'amount_asc') return a.totalAmount - b.totalAmount;
     return 0;
  });

  const tabs = [
    { value: 'all', label: 'Toutes' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'sent', label: 'Envoyées' },
    { value: 'paid', label: 'Payées' },
    { value: 'overdue', label: 'En attente' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Factures</h2>
        <Link href="/factures/nouvelle" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Nouvelle facture</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2 w-full">
          <form className="flex w-full md:max-w-sm items-center space-x-2">
            <div className="relative flex-1 w-full">
               <Input 
                 name="q" 
                 placeholder="Rechercher par numéro (INV-)..." 
                 defaultValue={searchParams.q} 
                 className="pr-10" 
                 list="invoices-list"
                 autoComplete="off"
               />
               <datalist id="invoices-list">
                 {Array.from(new Set(invoices.map(i => i.invoiceNumber).filter(Boolean))).map(num => (
                   <option key={num as string} value={num as string} />
                 ))}
               </datalist>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronDown className="w-4 h-4" />
               </div>
            </div>
            <input type="hidden" name="status" value={statusFilter || 'all'} />
            <input type="hidden" name="sort" value={sort} />
          </form>
        </div>
        
        <div className="flex gap-1 bg-muted p-1 rounded-md overflow-x-auto">
          {tabs.map(tab => {
             const isActive = (statusFilter || 'all') === tab.value;
             return (
               <Link key={tab.value} href={`?q=${q||''}&status=${tab.value}&sort=${sort}`}>
                 <span className={`px-3 py-1.5 text-sm font-medium rounded-sm cursor-pointer whitespace-nowrap ${isActive ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-muted/80'}`}>
                   {tab.label}
                 </span>
               </Link>
             )
          })}
        </div>
      </div>

      {invoices.length > 0 ? (
        <div className="rounded-md border bg-card overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>
                   <Link href={`?q=${q||''}&status=${statusFilter||'all'}&sort=${sort === 'date_desc' ? 'date_asc' : 'date_desc'}`} className="hover:text-foreground">
                      Date {sort === 'date_desc' ? '↓' : sort === 'date_asc' ? '↑' : ''}
                   </Link>
                </TableHead>
                <TableHead>
                   <Link href={`?q=${q||''}&status=${statusFilter||'all'}&sort=${sort === 'amount_desc' ? 'amount_asc' : 'amount_desc'}`} className="hover:text-foreground">
                      Montant {sort === 'amount_desc' ? '↓' : sort === 'amount_asc' ? '↑' : ''}
                   </Link>
                </TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id} className="hover:bg-muted/50 group transition-colors duration-200">
                  <TableCell className="font-medium">
                     <Link href={`/factures/${inv.id}`} className="hover:underline text-primary">
                        {inv.invoiceNumber || 'Brouillon'}
                     </Link>
                  </TableCell>
                  <TableCell>{getClientName(inv.clientId)}</TableCell>
                  <TableCell>{inv.issueDate}</TableCell>
                  <TableCell>{formatFCFA(inv.totalAmount)}</TableCell>
                  <TableCell>
                    <InvoiceStatusSelect invoiceId={inv.id} initialStatus={inv.status as any} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceActions invoice={inv} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState 
           title="Aucune facture" 
           description="Vous n'avez pas de factures correspondant à vos critères." 
           actionLabel="Créer une facture" 
           actionHref="/factures/nouvelle"
        />
      )}
    </div>
  )
}
