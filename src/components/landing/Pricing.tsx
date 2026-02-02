import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Loader2 } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function Pricing() {
  const { t } = useTranslation();
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: t("pricing.freeName"),
      price: t("pricing.freePrice"),
      period: t("pricing.perMonth"),
      description: t("pricing.freeDesc"),
      features: [
        { text: t("pricing.feature1Free"), included: true },
        { text: t("pricing.feature2Free"), included: true },
        { text: t("pricing.feature3"), included: true },
        { text: t("pricing.feature4Free"), included: true },
        { text: t("pricing.feature5"), included: true },
        { text: t("pricing.feature6"), included: false },
        { text: t("pricing.feature7"), included: false },
        { text: t("pricing.feature8"), included: false },
      ],
      cta: t("pricing.ctaFree"),
      variant: "outline" as const,
      popular: false,
    },
    {
      name: t("pricing.proName"),
      price: t("pricing.proPrice"),
      period: t("pricing.perMonth"),
      description: t("pricing.proDesc"),
      features: [
        { text: t("pricing.feature1Pro"), included: true },
        { text: t("pricing.feature2Pro"), included: true },
        { text: t("pricing.feature3"), included: true },
        { text: t("pricing.feature4Pro"), included: true },
        { text: t("pricing.feature6Pro"), included: true },
        { text: t("pricing.feature9Pro"), included: true },
        { text: t("pricing.feature10Pro"), included: true },
        { text: t("pricing.feature8"), included: true },
        { text: t("pricing.feature11Pro"), included: true },
      ],
      cta: t("pricing.ctaPro"),
      variant: "hero" as const,
      popular: true,
    },
  ];

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
            {t("pricing.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("pricing.title")}{" "}
            <span className="text-gradient-accent">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pricing.description")}
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
                    {t("common.mostPopular")}
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
                  disabled={loading || (plan.popular && subscription.subscribed)}
                  onClick={async () => {
                    if (!plan.popular) {
                      // Free plan - just go to app
                      navigate(user ? '/app' : '/auth');
                      return;
                    }
                    
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    
                    if (subscription.subscribed) {
                      toast({
                        title: "Você já é Pro!",
                        description: "Você já possui uma assinatura ativa.",
                      });
                      return;
                    }
                    
                    setLoading(true);
                    try {
                      const { data, error } = await supabase.functions.invoke('create-checkout');
                      
                      if (error) throw error;
                      
                      if (data?.url) {
                        window.open(data.url, '_blank');
                      }
                    } catch (error) {
                      console.error('Error creating checkout:', error);
                      toast({
                        title: "Erro",
                        description: "Erro ao iniciar checkout. Tente novamente.",
                        variant: "destructive",
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading && plan.popular ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {subscription.subscribed && plan.popular ? "Seu Plano Atual" : plan.cta}
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
              <p className="text-sm text-muted-foreground">{t("pricing.b2bText")}</p>
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t("pricing.b2bLink")}
              </a>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
