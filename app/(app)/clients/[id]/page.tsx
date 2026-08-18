import { clientsRepository, invoicesRepository } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ORG_ID = 'demo-org-123';

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    paid: 'Payé',
    overdue: 'En retard',
    cancelled: 'Annulée'
  };
  return labels[status] || status;
};

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await clientsRepository.findById(ORG_ID, params.id);
  
  if (!client) {
    notFound();
  }
  
  const invoices = await invoicesRepository.findAll(ORG_ID);
  const clientInvoices = invoices.filter(i => i.clientId === client.id).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  
  const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = clientInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
        <Button className="ml-auto">Modifier client</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
         <Card className="md:col-span-1">
            <CardHeader>
               <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{client.email || 'Non renseigné'}</span>
               </div>
               <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span>{client.phone || 'Non renseigné'}</span>
               </div>
               <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{client.address || 'Non renseigné'}</span>
               </div>
            </CardContent>
         </Card>
         
         <div className="md:col-span-2 grid gap-6 grid-cols-2">
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total facturé</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-bold">{formatFCFA(totalBilled)}</div>
                  <p className="text-sm text-muted-foreground mt-1">{clientInvoices.length} factures au total</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total payé</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-bold text-primary">{formatFCFA(totalPaid)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Reste à payer : {formatFCFA(totalBilled - totalPaid)}</p>
               </CardContent>
            </Card>
         </div>
      </div>
      
      <h3 className="text-xl font-semibold mt-8 mb-4">Historique des factures</h3>
      {clientInvoices.length > 0 ? (
         <div className="rounded-md border bg-card overflow-x-auto">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Numéro</TableHead>
                 <TableHead>Date d'émission</TableHead>
                 <TableHead>Montant</TableHead>
                 <TableHead>Statut</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {clientInvoices.map(inv => {
                 const isOverdue = inv.status === 'overdue';
                 return (
                   <TableRow key={inv.id}>
                     <TableCell className="font-medium">
                        <Link href={`/factures/${inv.id}`} className="hover:underline text-primary">
                           {inv.invoiceNumber || 'Brouillon'}
                        </Link>
                     </TableCell>
                     <TableCell>{inv.issueDate}</TableCell>
                     <TableCell>{formatFCFA(inv.totalAmount)}</TableCell>
                     <TableCell>
                       <Badge variant={
                         inv.status === 'paid' ? 'success' :
                         isOverdue ? 'destructive' :
                         inv.status === 'sent' ? 'warning' :
                         inv.status === 'draft' ? 'secondary' : 'default'
                       }>{getStatusLabel(inv.status)}</Badge>
                     </TableCell>
                   </TableRow>
                 )
               })}
             </TableBody>
           </Table>
         </div>
      ) : (
         <p className="text-muted-foreground">Aucune facture pour ce client.</p>
      )}
    </div>
  )
}
