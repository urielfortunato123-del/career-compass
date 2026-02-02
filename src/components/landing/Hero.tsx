import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-[90vh] py-20 text-center">
        {/* Badge */}
        <div className="animate-fade-in mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
            IA de Carreira sem promessas falsas
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="animate-slide-up text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-6">
          Pare de perder vagas por{" "}
          <span className="text-gradient">currículo errado</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up text-lg md:text-xl text-muted-foreground max-w-2xl mb-8" style={{ animationDelay: "0.1s" }}>
          O VagaJusta analisa seu currículo, ajusta para a vaga certa e mostra o 
          caminho mais curto até a contratação. Sem inventar experiência. 
          Só estratégia real.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 mb-12" style={{ animationDelay: "0.2s" }}>
          <Button variant="hero" size="xl" asChild>
            <Link to="/app">
              Analisar meu currículo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <a href="#como-funciona">Ver como funciona</a>
          </Button>
        </div>

        {/* Features quick list */}
        <div className="animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 text-left p-4 rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Currículo ATS</p>
              <p className="text-xs text-muted-foreground">Otimizado para triagem</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left p-4 rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Detector de Ciladas</p>
              <p className="text-xs text-muted-foreground">Vagas que não valem</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left p-4 rounded-xl bg-card shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Plano de Ação</p>
              <p className="text-xs text-muted-foreground">14, 30 ou 90 dias</p>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <p className="animate-fade-in mt-12 text-sm text-muted-foreground max-w-md" style={{ animationDelay: "0.4s" }}>
          💡 Primeira análise gratuita. Sem cartão de crédito.
        </p>
      </div>
    </section>
  );
}
