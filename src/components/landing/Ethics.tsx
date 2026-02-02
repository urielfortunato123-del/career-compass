import { Shield, Heart, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Sem Falsas Promessas",
    description: "Não garantimos emprego. Aumentamos suas chances com estratégia.",
  },
  {
    icon: Heart,
    title: "Respeito ao Candidato",
    description: "Nunca inventamos skills ou experiências que não existem.",
  },
  {
    icon: Target,
    title: "Foco em Resultado",
    description: "Estratégia real para quem quer trabalhar melhor.",
  },
];

export function Ethics() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background with subtle nebula */}
      <div className="absolute inset-0 nebula-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Ethics Statement */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary shadow-glow mb-8">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Nosso Compromisso com a{" "}
              <span className="text-gradient">Honestidade</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O VagaJusta não inventa experiências. Ele organiza, destaca e orienta 
              com base no que você já construiu.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="group glass-card text-center p-10 rounded-3xl hover:border-primary/40 transition-all duration-500 hover:shadow-glow hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all duration-300 icon-glow">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
