import { invoicesRepository } from "@/lib/data"
import { notFound } from "next/navigation"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export default async function ModifierFacturePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const orgId = user?.id || 'demo-org-123';

  const result = await invoicesRepository.findById(orgId, params.id);
  if (!result) notFound();

  const { invoice, lines } = result;

  const initialData = {
    ...invoice,
    lines: lines.map(l => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice }))
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/factures">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Modifier la facture {invoice.invoiceNumber || 'Brouillon'}</h2>
      </div>

      <InvoiceForm initialData={initialData} invoiceId={invoice.id} />
    </div>
  )
}
