import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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
    <section id="planos" className="py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o plano{" "}
            <span className="text-gradient">certo para você</span>
          </h2>
          <p className="text-muted-foreground">
            Comece grátis. Evolua quando precisar.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular 
                  ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10' 
                  : 'bg-card border border-border'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-primary text-sm font-medium text-primary-foreground">
                  Mais Popular
                </span>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${!feature.included ? 'text-muted-foreground/50' : ''}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} size="lg" className="w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Future B2B teaser */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            🏢 Empresas e instituições de ensino
          </p>
          <p className="text-sm">
            <a href="#" className="text-primary hover:underline font-medium">
              Conheça nosso plano educacional e corporativo →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
