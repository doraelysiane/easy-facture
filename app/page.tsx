"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Menu, ArrowRight, PlayCircle, CheckCircle, Check, 
  Bell, FileText, Calculator, TrendingDown, Rocket, 
  Percent, LineChart, Users, Star 
} from 'lucide-react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    const cleanupFns: (() => void)[] = [];
    
    magneticBtns.forEach(btn => {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const target = btn as HTMLElement;
        const position = target.getBoundingClientRect();
        const x = mouseEvent.clientX - position.left - position.width / 2;
        const y = mouseEvent.clientY - position.top - position.height / 2;
        target.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      };
      const handleMouseOut = () => {
        (btn as HTMLElement).style.transform = 'translate(0px, 0px)';
      };
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseout', handleMouseOut);
      cleanupFns.push(() => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseout', handleMouseOut);
      });
    });
    
    return () => cleanupFns.forEach(fn => fn());
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-green-200 selection:text-green-900">
      <style dangerouslySetInnerHTML={{__html: `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .floating {
            animation: float 4s ease-in-out infinite;
        }
        .floating-delayed {
            animation: float 4.5s ease-in-out infinite 1s;
        }
        .hover-bloom {
            transition: box-shadow 0.3s ease;
        }
        .hover-bloom:hover {
            box-shadow: 0 4px 20px rgba(34, 197, 94, 0.15);
        }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
      `}} />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary">Facto</Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Fonctionnalités</a>
            <a href="#tarifs" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Tarifs</a>
            <a href="#temoignages" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Témoignages</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-primary hover:opacity-90 transition-all duration-300 text-sm font-semibold px-4 py-2">Se connecter</Link>
            <Link href="/register" className="magnetic-btn bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-sm inline-block">Commencer gratuitement</Link>
          </div>
          <button className="md:hidden text-primary">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <main className="pt-24">
        {/* HERO */}
        <section className="relative pt-12 md:pt-24 pb-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-slate-50 to-slate-50"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10 reveal">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Fini les factures sur Word et Excel. <span className="text-primary">Facturez comme un pro en 2 clics.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl">
                La solution de facturation moderne, simple et adaptée aux entrepreneurs africains pour gérer vos paiements sans stress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="magnetic-btn bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#demo" className="magnetic-btn bg-white text-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-slate-100 transition-all duration-300 text-center flex items-center justify-center gap-2 border border-border">
                  <PlayCircle className="w-5 h-5" />
                  Voir la démo
                </Link>
              </div>
              <p className="text-sm font-semibold text-muted-foreground mt-6 flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" />
                Aucune carte bancaire requise. Annulez à tout moment.
              </p>
            </div>
            
            <div className="relative z-10 reveal lg:ml-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-200 rounded-full blur-3xl opacity-30 -z-10"></div>
              
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(34,197,94,0.15)] border border-border overflow-hidden relative">
                <div className="bg-slate-100 px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <img alt="Facto Dashboard Mockup" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3JzTxDRKjD--12F9SZnZ8BQFqMhnvhh0gSoERGLfywXUrteps03cnuPecmex2tbWu5drjyK7gwBbeNlVAupMYahcQa1r7KYvNYOIvj7-HCGwCEoGWZB3AvUB7CSL1gmfYOXoGtCIWaWAJdD0BepBFMQeOjAXCMSRKLQ_JxC84RrZZyMg84C_7zBdsSq1YPVXGhQFHhjS1sXBjeThkiJc9-PWVU0hCpnwsnIjJEHJCTuOJyAmJFVDt" />
                
                <div className="absolute -right-2 md:-right-6 top-20 bg-white p-4 rounded-xl shadow-lg border border-border floating flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Facture #001</p>
                    <p className="text-base font-bold text-foreground">Payée</p>
                  </div>
                </div>
                
                <div className="absolute -left-2 md:-left-8 bottom-12 bg-white p-4 rounded-xl shadow-lg border border-border floating-delayed flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Rappel auto</p>
                    <p className="text-base font-bold text-foreground">Envoyé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMES */}
        <section className="py-24 bg-white px-6 md:px-12 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pourquoi changer vos habitudes ?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les méthodes traditionnelles vous font perdre du temps et nuisent à votre image professionnelle.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-border hover-bloom reveal">
                <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Factures non professionnelles</h3>
                <p className="text-base text-muted-foreground">
                  Un document Word mal aligné donne une mauvaise impression à vos clients dès le premier contact.
                </p>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-border hover-bloom reveal delay-100">
                <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Calculs manuels de TVA</h3>
                <p className="text-base text-muted-foreground">
                  Le cauchemar du 18%. Les erreurs de calcul vous coûtent cher lors de vos déclarations fiscales.
                </p>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-border hover-bloom reveal delay-200">
                <div className="w-14 h-14 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center mb-6">
                  <TrendingDown className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Suivi des paiements impossible</h3>
                <p className="text-base text-muted-foreground">
                  Vous oubliez qui vous doit quoi. Les relances manuelles sont gênantes et chronophages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FONCTIONNALITES */}
        <section className="py-24 px-6 md:px-12 bg-slate-50" id="fonctionnalites">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Fonctionnalités</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Tout ce dont vous avez besoin.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-border relative overflow-hidden group reveal hover-bloom">
                <div className="relative z-10 w-full md:w-2/3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Factures professionnelles en 2 clics</h3>
                  <p className="text-base text-muted-foreground">Générez des factures à votre image, conformes aux normes locales, sans aucun effort de mise en page.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-1/2 h-full opacity-30 md:opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <img className="object-cover w-full h-full rounded-tl-2xl shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK8K7IPpj1MCUckCQ7PZQONcB6CDQdDmZkqyly4O7JFM9rTeMRMsvVliSQ9KcLR8oi7j90aU6a6V4pOTUkGjjpntlpS9ic-r1nizdYygcwdu6y2naI2HpeMtDOKkACYi_5iPdRHSlaAyxF3PN1LePCFdGrcXtDkd__0qNEdUsO-IGdgqKvbkOJokW09PEAN-9N82uzlVbSSrMMvlRsnVGbwjvTMZas89h-nRNGmjHfs0-W9q8Fkuhj" alt="Facture template" />
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-border relative overflow-hidden reveal hover-bloom delay-100">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-6">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">TVA 18% calculée</h3>
                <p className="text-base text-muted-foreground">Ajoutez ou retirez la TVA en un clic. Vos totaux sont toujours justes.</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-border relative overflow-hidden reveal hover-bloom delay-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Suivi en temps réel</h3>
                <p className="text-base text-muted-foreground">Tableau de bord clair pour voir instantanément vos revenus et impayés.</p>
              </div>
              
              <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 border border-border relative overflow-hidden reveal hover-bloom delay-300 flex items-center">
                <div className="w-full md:w-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Gestion de clients intégrée</h3>
                  <p className="text-base text-muted-foreground">Sauvegardez vos contacts. Ne retapez plus jamais les mêmes informations.</p>
                </div>
                <div className="hidden md:block w-1/2 absolute right-0 top-0 h-full">
                  <div className="w-full h-full bg-gradient-to-l from-green-100/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMMENT CA MARCHE */}
        <section className="py-24 bg-white px-6 md:px-12 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">La simplicité avant tout</h2>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="text-center reveal">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_0_8px_white]">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Inscris-toi</h3>
                  <p className="text-base text-muted-foreground">Crée ton compte en 30 secondes. C'est gratuit.</p>
                </div>
                <div className="text-center reveal delay-100">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-primary text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_0_8px_white]">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Crée ta facture</h3>
                  <p className="text-base text-muted-foreground">Remplis les champs, le design se génère tout seul.</p>
                </div>
                <div className="text-center reveal delay-200">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-border text-muted-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_0_8px_white]">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Envoie et encaisse</h3>
                  <p className="text-base text-muted-foreground">Partage le PDF ou le lien direct, et suis tes paiements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEMOIGNAGES */}
        <section className="py-24 bg-slate-50 px-6 md:px-12" id="temoignages">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ils ont professionnalisé leur activité</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-border hover-bloom reveal">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-base text-muted-foreground mb-6 italic">"Fini les heures passées sur Excel à vérifier mes formules de TVA. Facto me fait gagner un temps précieux chaque fin de mois."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-primary">A</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Amadou</p>
                    <p className="text-sm text-muted-foreground font-normal">Consultant IT, Dakar</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-border hover-bloom reveal delay-100">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                   <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-base text-muted-foreground mb-6 italic">"Mes clients me prennent beaucoup plus au sérieux depuis que j'utilise ces factures. Le design est impeccable."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-primary">ML</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Marie-Laure</p>
                    <p className="text-sm text-muted-foreground font-normal">Agence Digitale, Abidjan</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-border hover-bloom reveal delay-200">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                   <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-base text-muted-foreground mb-6 italic">"Le tableau de bord pour suivre qui a payé et qui est en retard est exactement ce qu'il me fallait pour gérer ma trésorerie."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-primary">K</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Koffi</p>
                    <p className="text-sm text-muted-foreground font-normal">Architecte, Lomé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TARIFICATION */}
        <section className="py-24 bg-white px-6 md:px-12" id="tarifs">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Des tarifs adaptés à votre croissance</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Payez en monnaie locale, sans surprise.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              <div className="bg-slate-50 rounded-3xl p-8 border border-border reveal">
                <h3 className="text-2xl font-bold text-foreground mb-2">Gratuit</h3>
                <p className="text-base text-muted-foreground mb-6">Pour démarrer</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-foreground">0</span>
                  <span className="text-base text-muted-foreground"> FCFA / mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">5 factures / mois</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">1 utilisateur</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">Modèles standards</span>
                  </li>
                </ul>
                <Link href="/register" className="block text-center w-full bg-white text-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all duration-300 border border-border">
                  S'inscrire
                </Link>
              </div>
              
              <div className="bg-primary rounded-3xl p-8 shadow-2xl shadow-primary/20 relative reveal delay-100 transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-200 text-green-900 px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                  Le plus populaire
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">Pro</h3>
                <p className="text-base text-primary-foreground/80 mb-6">Pour les indépendants actifs</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary-foreground">5 000</span>
                  <span className="text-base text-primary-foreground/80"> FCFA / mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-200 w-5 h-5" />
                    <span className="text-base text-primary-foreground">Factures illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-200 w-5 h-5" />
                    <span className="text-base text-primary-foreground">1 utilisateur</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-200 w-5 h-5" />
                    <span className="text-base text-primary-foreground">Logo personnalisé</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-200 w-5 h-5" />
                    <span className="text-base text-primary-foreground">Relances automatiques</span>
                  </li>
                </ul>
                <Link href="/register" className="block text-center w-full bg-white text-primary px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all duration-300 magnetic-btn">
                  Commencer l'essai
                </Link>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-8 border border-border reveal delay-200">
                <h3 className="text-2xl font-bold text-foreground mb-2">Business</h3>
                <p className="text-base text-muted-foreground mb-6">Pour les équipes</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-foreground">15 000</span>
                  <span className="text-base text-muted-foreground"> FCFA / mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">Tout du plan Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">Multi-utilisateurs (jusqu'à 5)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 w-5 h-5" />
                    <span className="text-base text-foreground">Gestion des rôles</span>
                  </li>
                </ul>
                <Link href="/contact" className="block text-center w-full bg-white text-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all duration-300 border border-border">
                  Contacter les ventes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 md:px-12 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-200/50 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden reveal">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/40 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 max-w-3xl mx-auto">
                  Rejoins les entrepreneurs qui facturent comme des pros
                </h2>
                <Link href="/register" className="magnetic-btn bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 inline-flex items-center gap-2 mt-4">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 bg-white border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 inline-block">Facto</Link>
            <p className="text-sm font-semibold text-muted-foreground mt-4">
              Fait avec fierté en Afrique
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground mb-2">Produit</p>
            <a href="#fonctionnalites" className="text-base text-muted-foreground hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="text-base text-muted-foreground hover:text-primary transition-colors">Tarifs</a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground mb-2">Entreprise</p>
            <Link href="/about" className="text-base text-muted-foreground hover:text-primary transition-colors">À propos</Link>
            <Link href="/contact" className="text-base text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground mb-2">Légal</p>
            <Link href="/cgv" className="text-base text-muted-foreground hover:text-primary transition-colors">CGV</Link>
            <Link href="/privacy" className="text-base text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
