import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Target, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen nebula-bg overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-glow opacity-50" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen py-24 text-center">
        {/* Badge */}
        <div className="animate-fade-in mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="w-4 h-4" />
            IA de Carreira sem promessas falsas
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="animate-slide-up text-4xl md:text-6xl lg:text-7xl font-bold max-w-5xl leading-tight mb-8">
          Pare de perder vagas por{" "}
          <span className="text-gradient-accent">currículo errado</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed" style={{ animationDelay: "0.15s" }}>
          O VagaJusta analisa seu currículo, ajusta para a vaga certa e mostra o 
          caminho mais curto até a contratação. Sem inventar experiência. 
          <span className="text-foreground font-medium"> Só estratégia real.</span>
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 mb-16" style={{ animationDelay: "0.25s" }}>
          <Button variant="hero" size="xl" className="shadow-glow animate-glow" asChild>
            <Link to="/app">
              Analisar meu currículo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className="border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5" asChild>
            <a href="#como-funciona">Ver como funciona</a>
          </Button>
        </div>

        {/* Features quick list */}
        <div className="animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow icon-glow">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Currículo ATS</p>
              <p className="text-sm text-muted-foreground">Otimizado para triagem</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow icon-glow">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Detector de Ciladas</p>
              <p className="text-sm text-muted-foreground">Vagas que não valem</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-primary/30 transition-all duration-300 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow icon-glow">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Plano de Ação</p>
              <p className="text-sm text-muted-foreground">14, 30 ou 90 dias</p>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <p className="animate-fade-in mt-14 text-sm text-muted-foreground" style={{ animationDelay: "0.45s" }}>
          ✨ Primeira análise gratuita. Sem cartão de crédito.
        </p>
      </div>
    </section>
  );
}
