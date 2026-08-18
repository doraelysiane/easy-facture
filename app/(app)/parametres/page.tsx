import { settingsRepository } from "@/lib/data"
import { ParametresForm } from "@/components/parametres/parametres-form"

const ORG_ID = 'demo-org-123';

export default async function ParametresPage() {
  const settings = await settingsRepository.getSettings(ORG_ID);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Paramètres</h2>
      </div>
      
      <ParametresForm settings={settings} />
    </div>
  )
}
