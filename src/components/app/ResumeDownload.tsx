import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Lock, Loader2, FileText, Crown, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResumeDownloadProps {
  resumeContent: string;
  fileName?: string;
}

const languages = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export function ResumeDownload({ resumeContent, fileName = "curriculo-ats" }: ResumeDownloadProps) {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const isPro = profile?.plan === "pro";

  const downloadContent = (content: string, langCode: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${langCode}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (targetLanguage?: string) => {
    if (!isPro) {
      setShowUpgradeDialog(true);
      return;
    }

    // If no target language or same as detected content language, download directly
    if (!targetLanguage || targetLanguage === "pt") {
      setDownloading(true);
      try {
        downloadContent(resumeContent, "pt");
      } catch (error) {
        console.error("Error downloading resume:", error);
        toast.error(t("app.resume.downloadError", "Erro ao baixar currículo"));
      } finally {
        setDownloading(false);
      }
      return;
    }

    // Translate first
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-resume", {
        body: { content: resumeContent, targetLanguage },
      });

      if (error) throw error;

      if (data?.translatedContent) {
        downloadContent(data.translatedContent, targetLanguage);
        toast.success(t("app.resume.translateSuccess", "Currículo traduzido e baixado!"));
      }
    } catch (error) {
      console.error("Error translating resume:", error);
      toast.error(t("app.resume.translateError", "Erro ao traduzir currículo"));
    } finally {
      setTranslating(false);
    }
  };

  const isLoading = downloading || translating;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isPro ? "hero" : "outline"}
            size="lg"
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {translating ? t("app.resume.translating", "Traduzindo...") : t("app.resume.preparing", "Preparando...")}
              </>
            ) : isPro ? (
              <>
                <Download className="w-5 h-5" />
                {t("app.resume.download", "Baixar Currículo")}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                {t("app.resume.downloadPro", "Baixar (Pro)")}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Languages className="w-4 h-4" />
            {t("app.resume.selectLanguage", "Idioma do download")}
          </div>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleDownload(lang.code)}
              className="gap-2 cursor-pointer"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === i18n.language && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {t("app.resume.current", "atual")}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              {t("app.resume.proFeature", "Funcionalidade Pro")}
            </DialogTitle>
            <DialogDescription>
              {t("app.resume.proDescription", "O download de currículos está disponível apenas no plano Pro.")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted rounded-xl p-4 mb-4">
              <h4 className="font-medium mb-2">{t("app.resume.proIncludes", "Com o plano Pro você tem:")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t("app.resume.unlimitedDownloads", "Downloads ilimitados de currículo")}
                </li>
                <li className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  {t("app.resume.translationFeature", "Tradução para múltiplos idiomas")}
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t("app.resume.unlimitedAnalyses", "Análises ilimitadas por mês")}
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t("app.resume.interviewSimulator", "Simulador de entrevista")}
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowUpgradeDialog(false)}
              >
                {t("app.resume.notNow", "Agora não")}
              </Button>
              <Button variant="hero" className="flex-1" asChild>
                <Link to="/#planos">
                  {t("app.resume.upgrade", "Fazer Upgrade")}
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
