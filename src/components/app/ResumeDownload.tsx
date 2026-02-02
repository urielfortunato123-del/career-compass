import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Lock, Loader2, FileText, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResumeDownloadProps {
  resumeContent: string;
  fileName?: string;
}

export function ResumeDownload({ resumeContent, fileName = "curriculo-ats" }: ResumeDownloadProps) {
  const { profile } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const isPro = profile?.plan === "pro";

  const handleDownload = async () => {
    if (!isPro) {
      setShowUpgradeDialog(true);
      return;
    }

    setDownloading(true);
    try {
      // Create a Blob with the resume content
      const blob = new Blob([resumeContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Button
        variant={isPro ? "hero" : "outline"}
        size="lg"
        onClick={handleDownload}
        disabled={downloading}
        className="gap-2"
      >
        {downloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Preparando...
          </>
        ) : isPro ? (
          <>
            <Download className="w-5 h-5" />
            Baixar Currículo
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Baixar (Pro)
          </>
        )}
      </Button>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              Funcionalidade Pro
            </DialogTitle>
            <DialogDescription>
              O download de currículos está disponível apenas no plano Pro.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted rounded-xl p-4 mb-4">
              <h4 className="font-medium mb-2">Com o plano Pro você tem:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Downloads ilimitados de currículo
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Formato PDF profissional
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Análises ilimitadas por mês
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Simulador de entrevista
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowUpgradeDialog(false)}
              >
                Agora não
              </Button>
              <Button variant="hero" className="flex-1" asChild>
                <Link to="/#planos">
                  Fazer Upgrade
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
