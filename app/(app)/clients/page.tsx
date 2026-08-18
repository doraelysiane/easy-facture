import { clientsRepository, invoicesRepository } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { ChevronDown } from "lucide-react"
import { ClientSearch } from "@/components/clients/client-search"
import { ClientDeleteButton } from "@/components/clients/client-delete-button"

const ORG_ID = 'demo-org-123';

export default async function ClientsPage(props: { searchParams: Promise<{ q?: string, sort?: string }> }) {
  const searchParams = await props.searchParams;
  let clients = await clientsRepository.findAll(ORG_ID);
  const invoices = await invoicesRepository.findAll(ORG_ID);

  const q = searchParams.q?.toLowerCase();
  if (q) {
    clients = clients.filter(c => c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)));
  }

  if (searchParams.sort === 'name_asc' || !searchParams.sort) {
    clients.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchParams.sort === 'name_desc') {
    clients.sort((a, b) => b.name.localeCompare(a.name));
  }

  const getInvoiceCount = (clientId: string) => {
    return invoices.filter(i => i.clientId === clientId).length;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Clients</h2>
      </div>
      
      <div className="flex items-center justify-between py-4">
        <ClientSearch initialValue={searchParams.q} phoneNumbers={Array.from(new Set(clients.map(c => c.phone).filter(Boolean)))} />
      </div>

      {clients.length > 0 ? (
        <div className="rounded-md border bg-card overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead className="text-right">Factures</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className="hover:bg-muted/50 group transition-colors duration-200">
                  <TableCell className="font-medium">
                    <Link href={`/clients/${client.id}`} className="block w-full h-full text-primary hover:underline group-hover:text-primary/80">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell className="text-right">{getInvoiceCount(client.id)}</TableCell>
                  <TableCell className="text-right w-[60px]">
                     <ClientDeleteButton id={client.id} clientName={client.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState 
           title="Aucun client trouvé" 
           description="Vous n'avez pas encore de clients ou votre recherche n'a donné aucun résultat." 
           actionLabel="Ajouter un client" 
           actionHref="#"
        />
      )}
    </div>
  )
}
