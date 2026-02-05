import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Lock, Loader2, FileText, Crown, Languages, FileType, File } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

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

type FileFormat = "pdf" | "word" | "markdown";

export function ResumeDownload({ resumeContent, fileName = "curriculo-ats" }: ResumeDownloadProps) {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>("pdf");

  const isPro = profile?.plan === "pro";

  // Parse markdown to structured content
  const parseMarkdownToSections = (markdown: string) => {
    const lines = markdown.split('\n');
    const sections: { type: 'h1' | 'h2' | 'h3' | 'text' | 'bullet'; content: string }[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        sections.push({ type: 'h3', content: trimmed.replace('### ', '') });
      } else if (trimmed.startsWith('## ')) {
        sections.push({ type: 'h2', content: trimmed.replace('## ', '') });
      } else if (trimmed.startsWith('# ')) {
        sections.push({ type: 'h1', content: trimmed.replace('# ', '') });
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        sections.push({ type: 'bullet', content: trimmed.replace(/^[-*]\s/, '') });
      } else if (trimmed) {
        // Clean up markdown formatting
        const cleaned = trimmed
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/__(.*?)__/g, '$1')
          .replace(/_(.*?)_/g, '$1');
        sections.push({ type: 'text', content: cleaned });
      }
    });
    
    return sections;
  };

  const downloadAsPDF = async (content: string, langCode: string) => {
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Convert markdown to HTML
    const sections = parseMarkdownToSections(content);
    let htmlContent = '<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">';
    
    sections.forEach(section => {
      switch (section.type) {
        case 'h1':
          htmlContent += `<h1 style="font-size: 24px; color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 16px;">${section.content}</h1>`;
          break;
        case 'h2':
          htmlContent += `<h2 style="font-size: 18px; color: #333; margin-top: 20px; margin-bottom: 10px;">${section.content}</h2>`;
          break;
        case 'h3':
          htmlContent += `<h3 style="font-size: 14px; color: #555; margin-top: 12px; margin-bottom: 8px;">${section.content}</h3>`;
          break;
        case 'bullet':
          htmlContent += `<p style="margin: 4px 0 4px 20px; font-size: 12px; color: #444;">• ${section.content}</p>`;
          break;
        case 'text':
          htmlContent += `<p style="margin: 8px 0; font-size: 12px; color: #444; line-height: 1.5;">${section.content}</p>`;
          break;
      }
    });
    
    htmlContent += '</div>';
    
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `${fileName}-${langCode}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    await html2pdf().set(opt).from(container).save();
    document.body.removeChild(container);
  };

  const downloadAsWord = async (content: string, langCode: string) => {
    const sections = parseMarkdownToSections(content);
    const children: Paragraph[] = [];
    
    sections.forEach(section => {
      switch (section.type) {
        case 'h1':
          children.push(
            new Paragraph({
              text: section.content,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            })
          );
          break;
        case 'h2':
          children.push(
            new Paragraph({
              text: section.content,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
            })
          );
          break;
        case 'h3':
          children.push(
            new Paragraph({
              text: section.content,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            })
          );
          break;
        case 'bullet':
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${section.content}`, size: 22 })],
              spacing: { before: 50, after: 50 },
              indent: { left: 720 },
            })
          );
          break;
        case 'text':
          children.push(
            new Paragraph({
              children: [new TextRun({ text: section.content, size: 22 })],
              spacing: { before: 100, after: 100 },
            })
          );
          break;
      }
    });
    
    const doc = new Document({
      sections: [{ properties: {}, children }],
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}-${langCode}.docx`);
  };

  const downloadAsMarkdown = (content: string, langCode: string) => {
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

  const downloadContent = async (content: string, langCode: string, format: FileFormat) => {
    switch (format) {
      case 'pdf':
        await downloadAsPDF(content, langCode);
        break;
      case 'word':
        await downloadAsWord(content, langCode);
        break;
      case 'markdown':
        downloadAsMarkdown(content, langCode);
        break;
    }
  };

  const handleDownload = async (targetLanguage: string, format: FileFormat) => {
    if (!isPro) {
      setShowUpgradeDialog(true);
      return;
    }

    setDownloading(true);
    try {
      let contentToDownload = resumeContent;
      
      // Translate if needed
      if (targetLanguage !== "pt") {
        setTranslating(true);
        const { data, error } = await supabase.functions.invoke("translate-resume", {
          body: { content: resumeContent, targetLanguage },
        });

        if (error) throw error;

        if (data?.translatedContent) {
          contentToDownload = data.translatedContent;
        }
        setTranslating(false);
      }
      
      await downloadContent(contentToDownload, targetLanguage, format);
      
      const formatName = format === 'pdf' ? 'PDF' : format === 'word' ? 'Word' : 'Markdown';
      toast.success(t("app.resume.downloadSuccess", `Currículo baixado em ${formatName}!`));
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error(t("app.resume.downloadError", "Erro ao baixar currículo"));
    } finally {
      setDownloading(false);
      setTranslating(false);
    }
  };

  const isLoading = downloading || translating;

  const formatIcons = {
    pdf: <FileText className="w-4 h-4" />,
    word: <FileType className="w-4 h-4" />,
    markdown: <File className="w-4 h-4" />,
  };

  const formatNames = {
    pdf: "PDF",
    word: "Word (.docx)",
    markdown: "Markdown (.md)",
  };

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
        <DropdownMenuContent align="end" className="w-56">
          {/* Format Selection */}
          <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            {t("app.resume.selectFormat", "Formato")}
          </DropdownMenuLabel>
          {(["pdf", "word", "markdown"] as FileFormat[]).map((format) => (
            <DropdownMenuItem
              key={format}
              onClick={() => setSelectedFormat(format)}
              className="gap-2 cursor-pointer"
            >
              {formatIcons[format]}
              <span>{formatNames[format]}</span>
              {selectedFormat === format && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Language Selection */}
          <DropdownMenuLabel className="flex items-center gap-2 text-muted-foreground">
            <Languages className="w-4 h-4" />
            {t("app.resume.selectLanguage", "Idioma do download")}
          </DropdownMenuLabel>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleDownload(lang.code, selectedFormat)}
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
                  <FileType className="w-4 h-4 text-primary" />
                  {t("app.resume.formatOptions", "Exportação em PDF, Word e Markdown")}
                </li>
                <li className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  {t("app.resume.translationFeature", "Tradução para múltiplos idiomas")}
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t("app.resume.unlimitedAnalyses", "Análises ilimitadas por mês")}
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