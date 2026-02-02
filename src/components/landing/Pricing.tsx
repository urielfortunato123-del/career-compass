import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para conhecer o produto",
    features: [
      { text: "1 upload de currículo por mês", included: true },
      { text: "1 análise de vaga", included: true },
      { text: "Score de empregabilidade", included: true },
      { text: "Visualização do currículo ATS", included: true },
      { text: "Detector de cilada", included: true },
      { text: "Download em PDF/DOCX", included: false },
      { text: "Plano de ação", included: false },
      { text: "Modo transição de carreira", included: false },
    ],
    cta: "Começar Grátis",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    description: "Produto principal para quem quer resultado",
    features: [
      { text: "Upload ilimitado de currículos", included: true },
      { text: "Análise ilimitada de vagas", included: true },
      { text: "Score de empregabilidade", included: true },
      { text: "Currículo ATS Base + Direcionado", included: true },
      { text: "Download em PDF e DOCX", included: true },
      { text: "Palavras-chave ATS detalhadas", included: true },
      { text: "Plano 14/30/90 dias", included: true },
      { text: "Modo transição de carreira", included: true },
      { text: "Simulador de entrevista", included: true },
    ],
    cta: "Assinar Pro",
    variant: "hero" as const,
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="planos" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] gradient-glow opacity-40" />

      <div className="container relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
            Planos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Escolha o plano{" "}
            <span className="text-gradient-accent">certo para você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis. Evolua quando precisar.
          </p>
        </ScrollAnimation>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollAnimation 
              key={plan.name}
              animation="fade-up"
              delay={0.1 + index * 0.15}
            >
              <div 
                className={`relative glass-card rounded-3xl p-10 transition-all duration-500 h-full ${
                  plan.popular 
                    ? 'border-primary/50 shadow-glow hover:shadow-xl' 
                    : 'hover:border-primary/30 hover:shadow-glow'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2 rounded-full gradient-primary text-sm font-semibold text-primary-foreground shadow-glow">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </span>
                )}

                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-success" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={`${!feature.included ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className={`w-full ${plan.popular ? 'shadow-glow animate-glow' : ''}`}
                >
                  {plan.cta}
                </Button>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Future B2B teaser */}
        <ScrollAnimation animation="fade-up" delay={0.4} className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
            <span className="text-2xl">🏢</span>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Empresas e instituições de ensino</p>
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Conheça nosso plano educacional e corporativo →
              </a>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
