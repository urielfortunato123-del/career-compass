import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Sparkles, Loader2, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import Confetti from "@/components/ui/confetti";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription, subscription } = useAuth();
  const { t } = useTranslation();
  const [checking, setChecking] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const verifySubscription = async () => {
      setChecking(true);
      // Give Stripe a moment to process the webhook
      await new Promise(resolve => setTimeout(resolve, 2000));
      await checkSubscription();
      setChecking(false);
      setShowConfetti(true);
    };

    if (searchParams.get("checkout") === "success") {
      verifySubscription();
    } else {
      setChecking(false);
      setShowConfetti(true);
    }
  }, [searchParams, checkSubscription]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {showConfetti && <Confetti />}
      
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 gradient-primary rounded-full animate-pulse opacity-30" />
          <div className="relative w-full h-full gradient-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">
            Bem-vindo ao{" "}
            <span className="text-gradient-accent">VagaJusta Pro!</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Sua assinatura foi ativada com sucesso. 🎉
          </p>
        </div>

        {/* Status Check */}
        {checking ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verificando sua assinatura...</span>
          </div>
        ) : subscription.subscribed ? (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-center gap-2 text-warning">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Plano Pro Ativo</span>
            </div>
            <ul className="text-left space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Análises ilimitadas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Currículos ATS otimizados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Planos de ação personalizados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Simulador de entrevistas
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Se sua assinatura não aparecer, aguarde alguns segundos e recarregue a página.
          </p>
        )}

        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl" 
          className="w-full"
          onClick={() => navigate("/app")}
        >
          <Rocket className="w-5 h-5 mr-2" />
          Começar a usar
        </Button>

        <p className="text-xs text-muted-foreground">
          Você pode gerenciar sua assinatura a qualquer momento no menu.
        </p>
      </div>
    </div>
  );
}
