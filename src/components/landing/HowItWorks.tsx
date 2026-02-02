import { Upload, Search, FileCheck, Rocket } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Upload,
      number: "01",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      icon: Search,
      number: "02",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      icon: FileCheck,
      number: "03",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
    {
      icon: Rocket,
      number: "04",
      title: t("howItWorks.step4Title"),
      description: t("howItWorks.step4Desc"),
    },
  ];

  return (
    <section id="como-funciona" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] gradient-glow opacity-30" />

      <div className="container relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up" className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-6">
            {t("howItWorks.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("howItWorks.title")}{" "}
            <span className="text-gradient">{t("howItWorks.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("howItWorks.description")}
          </p>
        </ScrollAnimation>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <ScrollAnimation 
              key={step.number} 
              animation="fade-up"
              delay={0.1 + index * 0.15}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative glass-card rounded-2xl p-8 hover:border-primary/40 transition-all duration-500 hover:shadow-glow group-hover:-translate-y-1 h-full">
                {/* Number badge */}
                <span className="absolute -top-4 -right-4 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 icon-glow">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
