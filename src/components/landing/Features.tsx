import { 
  FileText, 
  Shield, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Currículo ATS Inteligente",
    description: "Duas versões: base otimizada e direcionada para a vaga. Palavras-chave inseridas naturalmente.",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Detector de Vagas Cilada",
    description: "Identificamos sinais de risco e classificamos: Vaga Justa, Atenção ou Cilada Provável.",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Estimativa Realista de Tempo",
    description: "Saiba quanto tempo pode levar: 2-6 semanas, 2-4 meses ou mais. Sem falsas promessas.",
    highlight: false,
  },
  {
    icon: BookOpen,
    title: "Cursos e Projetos Recomendados",
    description: "Identificamos lacunas reais e sugerimos cursos curtos e projetos práticos que destravam entrevistas.",
    highlight: false,
  },
  {
    icon: MessageSquare,
    title: "Simulador de Entrevista",
    description: "5 perguntas prováveis da vaga com respostas modelo e correção de erros comuns.",
    highlight: false,
  },
  {
    icon: RefreshCw,
    title: "Modo Transição de Carreira",
    description: "Título híbrido, tradução de experiências e prioridade para projetos. Para quem quer mudar de área.",
    highlight: true,
  },
];

const statusIndicators = [
  { icon: CheckCircle, label: "Vaga Justa", color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/30" },
  { icon: AlertTriangle, label: "Atenção", color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
  { icon: XCircle, label: "Cilada Provável", color: "text-danger", bgColor: "bg-danger/10", borderColor: "border-danger/30" },
];

export function Features() {
  return (
    <section id="recursos" className="relative py-28 overflow-hidden">
      {/* Background nebula effect */}
      <div className="absolute inset-0 nebula-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
            Recursos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Tudo que você precisa para{" "}
            <span className="text-gradient-accent">conseguir a vaga</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ferramentas práticas, sem enrolação, focadas em resultado.
          </p>
        </div>

        {/* Status Indicators Preview */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {statusIndicators.map((status) => (
            <div 
              key={status.label}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full glass-card ${status.borderColor}`}
            >
              <status.icon className={`w-5 h-5 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className={`relative glass-card p-8 rounded-2xl transition-all duration-500 hover:shadow-glow group ${
                feature.highlight 
                  ? 'border-primary/30 shadow-lg shadow-primary/5' 
                  : 'hover:border-primary/30'
              }`}
            >
              {feature.highlight && (
                <span className="absolute -top-3 right-6 px-4 py-1.5 rounded-full gradient-primary text-xs font-semibold text-primary-foreground shadow-glow">
                  Destaque
                </span>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 icon-glow ${
                feature.highlight ? 'gradient-primary shadow-glow' : 'bg-primary/10 group-hover:bg-primary/20'
              }`}>
                <feature.icon className={`w-7 h-7 ${feature.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>

              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
