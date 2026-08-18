import { invoicesRepository, clientsRepository } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import Link from "next/link"
import { PrintButton } from "@/components/invoices/print-button"

const ORG_ID = 'demo-org-123';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const data = await invoicesRepository.findById(ORG_ID, params.id);
  
  if (!data) {
    notFound();
  }
  
  const client = await clientsRepository.findById(ORG_ID, data.invoice.clientId);

  return (
    <div className="space-y-6 max-w-3xl mx-auto print:m-0 print:max-w-none print:w-full">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold tracking-tight">Facture {data.invoice.invoiceNumber || 'Brouillon'}</h2>
        <div className="flex gap-4">
          <Link href="/factures">
            <Button variant="outline">Retour</Button>
          </Link>
          <PrintButton />
        </div>
      </div>
      
      <Card className="p-12 min-h-[1056px] bg-white shadow-2xl print:shadow-none print:border-none print:p-0">
         <div className="flex justify-between items-start mb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight text-primary">FACTURE</h1>
               <p className="text-muted-foreground mt-2">{data.invoice.invoiceNumber || 'Brouillon'}</p>
            </div>
            <div className="text-right">
               <h3 className="font-bold text-xl">{client?.name}</h3>
               <p className="text-muted-foreground">{client?.address}</p>
               <p className="text-muted-foreground">{client?.phone}</p>
               <p className="text-muted-foreground">{client?.email}</p>
            </div>
         </div>
         
         <div className="mb-8 grid grid-cols-2 gap-4 border-y py-6 bg-muted/20 print:bg-transparent print:border-y-2">
            <div>
               <p className="font-semibold text-sm text-muted-foreground">Date d'émission</p>
               <p className="font-medium text-lg">{data.invoice.issueDate}</p>
            </div>
            <div>
               <p className="font-semibold text-sm text-muted-foreground">Échéance</p>
               <p className="font-medium text-lg">{data.invoice.dueDate}</p>
            </div>
         </div>
         
         <div className="border rounded-md overflow-hidden mb-8 print:border-none">
            <table className="w-full text-sm">
               <thead className="bg-muted print:bg-transparent print:border-b-2">
                  <tr>
                     <th className="text-left p-4 font-semibold">Description</th>
                     <th className="text-center p-4 font-semibold">Qté</th>
                     <th className="text-right p-4 font-semibold">Prix Unitaire</th>
                     <th className="text-right p-4 font-semibold">Total</th>
                  </tr>
               </thead>
               <tbody>
                  {data.lines.map((line, idx) => (
                     <tr key={idx} className="border-t">
                        <td className="p-4 print:px-0">{line.description}</td>
                        <td className="p-4 text-center print:px-0">{line.quantity}</td>
                        <td className="p-4 text-right print:px-0">{formatFCFA(line.unitPrice)}</td>
                        <td className="p-4 text-right print:px-0">{formatFCFA(line.lineTotal)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="flex justify-end mt-8">
            <div className="w-72 space-y-3 text-right">
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total HT:</span>
                  <span>{formatFCFA(data.invoice.subtotalAmount)}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA ({data.invoice.vatRate}%):</span>
                  <span>{formatFCFA(data.invoice.vatAmount)}</span>
               </div>
               <div className="flex justify-between font-bold text-2xl border-t pt-3">
                  <span>Total TTC:</span>
                  <span className="text-primary">{formatFCFA(data.invoice.totalAmount)}</span>
               </div>
            </div>
         </div>
         {data.invoice.notes && (
            <div className="mt-16 pt-8 border-t text-sm text-muted-foreground print:text-xs">
               <p className="font-semibold mb-1 text-foreground">Notes:</p>
               <p>{data.invoice.notes}</p>
            </div>
         )}
      </Card>
    </div>
  )
}
