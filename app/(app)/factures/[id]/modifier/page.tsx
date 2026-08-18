import { invoicesRepository } from "@/lib/data"
import { notFound } from "next/navigation"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ORG_ID = 'demo-org-123';

export default async function ModifierFacturePage({ params }: { params: { id: string } }) {
  const result = await invoicesRepository.findById(ORG_ID, params.id);
  if (!result) notFound();

  const { invoice, lines } = result;

  const initialData = {
    ...invoice,
    lines: lines.map(l => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice }))
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/factures/${invoice.id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Modifier la facture {invoice.invoiceNumber || 'Brouillon'}</h2>
      </div>

      <InvoiceForm initialData={initialData} invoiceId={invoice.id} />
    </div>
  )
}
