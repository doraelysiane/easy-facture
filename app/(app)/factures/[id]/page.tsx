import { invoicesRepository, clientsRepository } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatFCFA } from "@/lib/domain/invoice-calculations"
import Link from "next/link"
import { PrintButton } from "@/components/invoices/print-button"
import { InvoicePreview } from "@/components/invoices/invoice-preview"

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
         <InvoicePreview data={{
            clientName: client?.name,
            clientPhone: client?.phone,
            issueDate: data.invoice.issueDate,
            dueDate: data.invoice.dueDate,
            lines: data.lines,
            vatRate: data.invoice.vatRate,
            status: data.invoice.status,
            invoiceNumber: data.invoice.invoiceNumber,
            subtotalAmount: data.invoice.subtotalAmount,
            vatAmount: data.invoice.vatAmount,
            totalAmount: data.invoice.totalAmount,
            notes: data.invoice.notes
         }} />
      </div>
    </div>
  )
}
