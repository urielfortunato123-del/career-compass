import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, CheckCircle, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 nebula-bg opacity-40" />
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-lg px-4">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src={logo} alt="VagaJusta" className="h-20 w-auto mx-auto" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl border border-border/50 p-10 shadow-xl">
            {isInstalled ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-4">App Instalado!</h1>
                <p className="text-muted-foreground mb-8">
                  O VagaJusta já está instalado no seu dispositivo. Você pode acessá-lo diretamente da sua tela inicial.
                </p>
                <Button variant="hero" size="lg" className="shadow-glow" asChild>
                  <Link to="/app">Ir para o App</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Download className="w-4 h-4" />
                    Instale o App
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    VagaJusta no seu dispositivo
                  </h1>
                  <p className="text-muted-foreground">
                    Instale o app para acesso rápido e experiência offline
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                    <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Acesso Rápido</p>
                      <p className="text-sm text-muted-foreground">
                        Abra direto da tela inicial, sem precisar do navegador
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                    <Monitor className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Funciona Offline</p>
                      <p className="text-sm text-muted-foreground">
                        Acesse suas análises mesmo sem internet
                      </p>
                    </div>
                  </div>
                </div>

                {deferredPrompt ? (
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full shadow-glow"
                    onClick={handleInstall}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Instalar Agora
                  </Button>
                ) : isIOS ? (
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Para instalar no iPhone/iPad:</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta) e depois em <strong>"Adicionar à Tela de Início"</strong>
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Clique no ícone de instalação na barra de endereço do navegador ou no menu para instalar o app.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
