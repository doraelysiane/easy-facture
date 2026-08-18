import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NouvelleFacturePage() {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold tracking-tight">Nouvelle Facture</h2>
      </div>
      <InvoiceForm />
    </div>
  )
}
