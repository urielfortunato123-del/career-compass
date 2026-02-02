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
  { icon: CheckCircle, label: "Vaga Justa", color: "text-success", bgColor: "bg-success/10" },
  { icon: AlertTriangle, label: "Atenção", color: "text-warning", bgColor: "bg-warning/10" },
  { icon: XCircle, label: "Cilada Provável", color: "text-danger", bgColor: "bg-danger/10" },
];

export function Features() {
  return (
    <section id="recursos" className="py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Recursos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="text-gradient">conseguir a vaga</span>
          </h2>
          <p className="text-muted-foreground">
            Ferramentas práticas, sem enrolação, focadas em resultado.
          </p>
        </div>

        {/* Status Indicators Preview */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {statusIndicators.map((status) => (
            <div 
              key={status.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor}`}
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
              className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                feature.highlight 
                  ? 'bg-card border-2 border-primary/20 shadow-md' 
                  : 'bg-card border border-border hover:border-primary/20'
              }`}
            >
              {feature.highlight && (
                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full gradient-primary text-xs font-medium text-primary-foreground">
                  Destaque
                </span>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                feature.highlight ? 'gradient-primary' : 'bg-primary/10'
              }`}>
                <feature.icon className={`w-6 h-6 ${feature.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>

              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
