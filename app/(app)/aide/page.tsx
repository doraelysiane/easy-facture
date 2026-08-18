import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HelpCircle, Mail, BookOpen, CheckCircle } from "lucide-react"

export default function AidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Aide et support</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-fade-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
        <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Comment utiliser Izifacture
            </CardTitle>
            <CardDescription>
              Voici les étapes principales pour bien démarrer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                 <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 <span><strong>Tableau de bord :</strong> Suivez vos statistiques financières et l'évolution de votre chiffre d'affaires.</span>
              </li>
              <li className="flex gap-2">
                 <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 <span><strong>Créer une facture :</strong> Remplissez les informations de votre client et vos articles, puis enregistrez ou téléchargez la facture (une fois payée).</span>
              </li>
              <li className="flex gap-2">
                 <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 <span><strong>Paramètres :</strong> Personnalisez le nom de votre entreprise, votre devise par défaut et d'autres informations qui apparaîtront sur vos factures.</span>
              </li>
              <li className="flex gap-2">
                 <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 <span><strong>Clients :</strong> Retrouvez la liste de tous vos clients et accédez rapidement à leurs informations de contact.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contacter le support
            </CardTitle>
            <CardDescription>
              Besoin d'aide supplémentaire ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Si vous avez des questions ou si vous rencontrez un problème technique, n'hésitez pas à nous envoyer un e-mail à :
            </p>
            <a href="mailto:support@izifacture.com" className="font-semibold text-primary hover:underline">
              support@izifacture.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
