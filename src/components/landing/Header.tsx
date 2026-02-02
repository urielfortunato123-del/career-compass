import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Crown, Loader2, Settings, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { user, signOut, loading, subscription } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de assinatura.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="VagaJusta" className="h-20 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t("nav.howItWorks")}
          </a>
          <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t("nav.features")}
          </a>
          <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t("nav.plans")}
          </a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t("nav.about")}
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {loading ? null : user ? (
            <>
              {subscription.subscribed && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  PRO
                </div>
              )}
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/history">{t("common.history")}</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/settings">
                  <User className="w-4 h-4 mr-1" />
                  Perfil
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/app">{t("common.newAnalysis")}</Link>
              </Button>
              {subscription.subscribed && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                  <span className="ml-1">Assinatura</span>
                </Button>
              )}
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link to="/admin">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" className="border-muted-foreground/30" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/auth">{t("common.login")}</Link>
              </Button>
              <Button variant="default" size="sm" className="shadow-glow" asChild>
                <Link to="/auth">{t("common.signup")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button 
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
          <nav className="container py-6 flex flex-col gap-4">
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.howItWorks")}
            </a>
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.features")}
            </a>
            <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.plans")}
            </a>
            <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("nav.about")}
            </a>
            <hr className="border-border/50" />
            {user ? (
              <>
                {subscription.subscribed && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium w-fit">
                    <Crown className="w-3 h-3" />
                    PRO
                  </div>
                )}
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/history">{t("common.history")}</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/settings">
                    <User className="w-4 h-4 mr-2" />
                    Configurações
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/app">{t("common.newAnalysis")}</Link>
                </Button>
                {subscription.subscribed && (
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                  >
                    {portalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Settings className="w-4 h-4 mr-2" />
                    )}
                    Gerenciar Assinatura
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="ghost" className="justify-start text-primary" asChild>
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("common.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/auth">{t("common.login")}</Link>
                </Button>
                <Button variant="default" className="shadow-glow">
                  <Link to="/auth">{t("common.signup")}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
