import { useState, useCallback } from "react";
import { extractTextFromPDF, OCRProgress, OCRResult, isValidPDF } from "@/lib/pdf-ocr";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ParsedResume {
  text: string;
  isScanned: boolean;
  pageCount: number;
  ocrConfidence?: number;
  structuredData?: Record<string, unknown>;
}

export function usePDFParser() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [result, setResult] = useState<ParsedResume | null>(null);
  const { toast } = useToast();

  const parseResume = useCallback(async (file: File): Promise<ParsedResume | null> => {
    if (!isValidPDF(file)) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie um arquivo PDF.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setProgress(null);
    setResult(null);

    try {
      // Step 1: Extract text from PDF (with OCR if needed)
      const ocrResult = await extractTextFromPDF(file, setProgress);

      if (!ocrResult.text || ocrResult.text.length < 50) {
        toast({
          title: "PDF vazio ou ilegível",
          description: "Não foi possível extrair texto do PDF. Verifique se o arquivo está correto.",
          variant: "destructive",
        });
        setLoading(false);
        return null;
      }

      toast({
        title: ocrResult.isScanned ? "OCR concluído!" : "Texto extraído!",
        description: ocrResult.isScanned
          ? `${ocrResult.pageCount} páginas processadas com ${Math.round(ocrResult.ocrConfidence || 0)}% de confiança`
          : `${ocrResult.pageCount} páginas processadas`,
      });

      // Step 2: Send to AI for structured parsing
      setProgress({
        stage: "complete",
        progress: 95,
        message: "Analisando conteúdo com IA...",
      });

      const { data: structuredData, error } = await supabase.functions.invoke("parse-resume", {
        body: { text: ocrResult.text },
      });

      if (error) {
        console.error("Error parsing resume:", error);
        // Still return the raw text even if AI parsing fails
      }

      const parsedResult: ParsedResume = {
        text: ocrResult.text,
        isScanned: ocrResult.isScanned,
        pageCount: ocrResult.pageCount,
        ocrConfidence: ocrResult.ocrConfidence,
        structuredData: structuredData || undefined,
      };

      setResult(parsedResult);
      setProgress({
        stage: "complete",
        progress: 100,
        message: "Processamento completo!",
      });

      return parsedResult;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Erro ao processar o PDF",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setLoading(false);
    setProgress(null);
    setResult(null);
  }, []);

  return {
    parseResume,
    loading,
    progress,
    result,
    reset,
  };
}
