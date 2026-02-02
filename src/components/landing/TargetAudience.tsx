import { UserCheck, RefreshCw, HelpCircle, Clock } from "lucide-react";

const audiences = [
  {
    icon: UserCheck,
    title: "Quem está aplicando e não recebe retorno",
    description: "Seu currículo pode estar sendo filtrado antes de chegar ao recrutador.",
  },
  {
    icon: RefreshCw,
    title: "Quem quer mudar de área",
    description: "Transição de carreira com estratégia, não com achismo.",
  },
  {
    icon: HelpCircle,
    title: "Quem não sabe se a vaga vale a pena",
    description: "Detectamos sinais de cilada antes de você perder tempo.",
  },
  {
    icon: Clock,
    title: "Quem quer parar de perder tempo",
    description: "Foco nas candidaturas certas com currículo certo.",
  },
];

export function TargetAudience() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Para Quem é
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Você se identifica com{" "}
            <span className="text-gradient">algum desses?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {audiences.map((item) => (
            <div 
              key={item.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
