import { UserCheck, RefreshCw, HelpCircle, Clock } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

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
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container relative z-10">
        <ScrollAnimation animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
            Para Quem é
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Você se identifica com{" "}
            <span className="text-gradient">algum desses?</span>
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {audiences.map((item, index) => (
            <ScrollAnimation 
              key={item.title}
              animation={index % 2 === 0 ? "fade-right" : "fade-left"}
              delay={0.1 + index * 0.1}
            >
              <div 
                className="group relative glass-card p-8 rounded-2xl hover:border-primary/40 transition-all duration-500 hover:shadow-glow hover:-translate-y-1 h-full"
              >
                {/* Decorative number */}
                <span className="absolute top-6 right-6 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  0{index + 1}
                </span>
                
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow icon-glow">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
