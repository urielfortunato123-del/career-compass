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
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { useTranslation } from "react-i18next";

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: FileText,
      title: t("features.atsTitle"),
      description: t("features.atsDesc"),
      highlight: true,
    },
    {
      icon: Shield,
      title: t("features.trapTitle"),
      description: t("features.trapDesc"),
      highlight: false,
    },
    {
      icon: Clock,
      title: t("features.timeTitle"),
      description: t("features.timeDesc"),
      highlight: false,
    },
    {
      icon: BookOpen,
      title: t("features.coursesTitle"),
      description: t("features.coursesDesc"),
      highlight: false,
    },
    {
      icon: MessageSquare,
      title: t("features.interviewTitle"),
      description: t("features.interviewDesc"),
      highlight: false,
    },
    {
      icon: RefreshCw,
      title: t("features.transitionTitle"),
      description: t("features.transitionDesc"),
      highlight: true,
    },
  ];

  const statusIndicators = [
    { icon: CheckCircle, label: t("features.statusFair"), color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/30" },
    { icon: AlertTriangle, label: t("features.statusWarning"), color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/30" },
    { icon: XCircle, label: t("features.statusTrap"), color: "text-danger", bgColor: "bg-danger/10", borderColor: "border-danger/30" },
  ];

  return (
    <section id="recursos" className="relative py-28 overflow-hidden">
      {/* Background nebula effect */}
      <div className="absolute inset-0 nebula-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
            {t("features.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("features.title")}{" "}
            <span className="text-gradient-accent">{t("features.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("features.description")}
          </p>
        </ScrollAnimation>

        {/* Status Indicators Preview */}
        <ScrollAnimation animation="fade-up" delay={0.1} className="flex flex-wrap justify-center gap-4 mb-16">
          {statusIndicators.map((status) => (
            <div 
              key={status.label}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full glass-card ${status.borderColor}`}
            >
              <status.icon className={`w-5 h-5 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
          ))}
        </ScrollAnimation>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <ScrollAnimation 
              key={feature.title}
              animation="fade-up" 
              delay={0.1 + index * 0.1}
            >
              <div 
                className={`relative glass-card p-8 rounded-2xl transition-all duration-500 hover:shadow-glow group h-full ${
                  feature.highlight 
                    ? 'border-primary/30 shadow-lg shadow-primary/5' 
                    : 'hover:border-primary/30'
                }`}
              >
                {feature.highlight && (
                  <span className="absolute -top-3 right-6 px-4 py-1.5 rounded-full gradient-primary text-xs font-semibold text-primary-foreground shadow-glow">
                    {t("common.highlight")}
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
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
