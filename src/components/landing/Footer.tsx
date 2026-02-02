import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-background" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="VagaJusta" className="h-24 w-auto" />
            </a>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              {t("footer.tagline")}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:contato@vagajusta.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                contato@vagajusta.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-6 text-foreground">{t("footer.product")}</h4>
            <ul className="space-y-4">
              <li><a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.howItWorks")}</a></li>
              <li><a href="#recursos" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.features")}</a></li>
              <li><a href="#planos" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.plans")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">{t("footer.support")}</h4>
            <ul className="space-y-4">
              <li><a href="/ajuda" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.helpCenter")}</a></li>
              <li><a href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.privacy")}</a></li>
              <li><a href="/termos" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.terms")}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 VagaJusta. {t("footer.rights")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
