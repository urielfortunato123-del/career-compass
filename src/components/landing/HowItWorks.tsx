import { Upload, Search, FileCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Envie seu currículo",
    description: "Faça upload do seu PDF. Currículos digitais ou escaneados são aceitos.",
  },
  {
    icon: Search,
    number: "02",
    title: "Cole a vaga desejada",
    description: "Informe o cargo ou cole o texto da vaga. Nossa IA identifica o que importa.",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Veja o antes e depois",
    description: "Currículo otimizado para ATS, com palavras-chave e estrutura correta.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Receba seu plano de ação",
    description: "Saiba exatamente o que fazer para conseguir a vaga mais rápido.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            4 passos para um currículo que{" "}
            <span className="text-gradient">passa na triagem</span>
          </h2>
          <p className="text-muted-foreground">
            Processo simples e direto. Sem complicação, sem enrolação.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300">
                {/* Number badge */}
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
