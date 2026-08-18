# Izifacture - Documentation & Contexte du Projet

## 📌 Ce que l'application fait
**Izifacture** est une application web de facturation simplifiée destinée aux petites et moyennes entreprises, particulièrement adaptée au marché francophone et ouest-africain (support des devises XOF/XAF). Elle permet de gérer des clients, de générer des factures professionnelles, de suivre le chiffre d'affaires et de télécharger les factures en PDF, le tout via une interface premium et ultra-rapide.

## ✨ Fonctionnalités Implémentées
1. **Authentification** : 
   - Système de connexion et d'inscription (actuellement simulé).
   - Un compte administrateur permanent par défaut (`admin@izifacture.com` / `admin`).
2. **Tableau de Bord (Dashboard)** : 
   - Indicateurs clés (Total facturé, En attente, Payé, En retard).
   - Graphique d'évolution des revenus (Recharts).
3. **Gestion des Clients** : 
   - Liste des clients avec recherche par nom/téléphone.
   - Ajout, modification et suppression (avec modale de confirmation sécurisée).
4. **Gestion des Factures** : 
   - Création de factures "Zéro Scroll" (tout sur un seul écran).
   - Ajout dynamique de lignes de facturation (calcul automatique du sous-total, de la TVA et du total TTC).
   - Gestion des statuts : Brouillon, Envoyée, Payée, En retard, Annulée.
   - Prévisualisation en temps réel de la facture.
   - Impression/Export PDF natif via `window.print()`.
5. **Paramètres de l'entreprise** : 
   - Configuration du profil (Nom, NIF, Adresse, etc.).
   - Configuration des préférences (Devise par défaut, Taux de TVA par défaut).
6. **UI/UX Premium** : 
   - Système de notifications "Toast" sur mesure (remplaçant les `alert()` natifs).
   - Animations fluides d'apparition (`fade-slide-up`).
   - Responsivité mobile avancée (menu latéral transformé en barre de navigation horizontale défilable sur mobile).

## 📁 Structure des Fichiers
- `/app` : Pages de l'application (Next.js App Router).
  - `/(app)` : Routes protégées (nécessitent une connexion).
  - `/login`, `/register` : Routes d'authentification publiques.
- `/components` : Composants React réutilisables.
  - `/ui` : Composants de base (Boutons, Inputs, Modales, Toaster).
  - `/layout` : Composants structurels (Sidebar, Topbar).
  - `/invoices`, `/clients`, `/dashboard`, `/parametres` : Composants spécifiques aux domaines.
- `/lib` : Logique métier et utilitaires.
  - `/actions` : Server Actions Next.js pour les mutations de données.
  - `/data` : Couche d'accès aux données (Pattern Repository).
  - `/data/local/store.ts` : Base de données locale en mémoire (Mock).
  - `/validation` : Schémas Zod pour la validation des formulaires.

## 🛠️ Technologies Utilisées
- **Framework** : Next.js 14 (App Router)
- **Bibliothèque UI** : React 19
- **Langage** : TypeScript (Typage strict activé)
- **Stylisation** : Tailwind CSS 4 (avec variables CSS natives et classes personnalisées)
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Validation** : Zod + React Hook Form

## 🎨 Décisions de Design
1. **Zéro Scroll** : L'écran de création de facture a été conçu pour tenir sur une seule page (Détails à gauche, Prévisualisation à droite), évitant à l'utilisateur de devoir scroller constamment.
2. **Abstraction des Données (Repository Pattern)** : L'application utilise des interfaces (`IClientsRepository`, `IInvoicesRepository`) pour interagir avec les données. Actuellement branchée sur un store local en mémoire (`store.ts`), cette architecture permet de basculer vers une vraie base de données (ex: Supabase, Prisma) en modifiant uniquement l'implémentation du repository sans toucher à l'UI.
3. **Animations Premium** : Utilisation intensive de la classe `.animate-fade-slide-up` pour donner une sensation de fluidité et de modernité à chaque changement d'écran.
4. **Pas d'alertes natives** : Les popups systèmes (`window.alert`) sont interdits au profit du composant personnalisé `<Toaster />` pour une expérience utilisateur harmonieuse.

## 🤖 Instructions pour un futur modèle IA
*Cher modèle IA lisant ce fichier, voici comment interagir avec ce projet :*
- **Aesthetics First** : Le design est primordial. Ne génère jamais de code avec des couleurs basiques (rouge pur, bleu pur). Utilise toujours les variables CSS sémantiques ou Tailwind (ex: `text-muted-foreground`, `bg-card`).
- **Data Mutation** : Toutes les modifications de données doivent passer par les Server Actions situées dans `/lib/actions` et appeler les méthodes du Repository concerné.
- **Typage Strict** : Le fichier `lib/data/types.ts` est la source de vérité. Ne modifie pas les types sans vérifier les répercussions dans le `store.ts` et les composants qui les utilisent (Vercel échouera au build si le typage est cassé).
- **Mock Data** : Si l'utilisateur signale que ses données disparaissent après un rechargement local, rappelle-lui que le `store.ts` est réinitialisé en mode développement (`npm run dev`).
- **Extensions** : Lors de l'ajout d'une nouvelle fonctionnalité, assure-toi qu'elle soit "Mobile First", en vérifiant que les éléments ne débordent pas sur petit écran (utilise `overflow-x-auto` et la classe `.scrollbar-hide` si nécessaire).
