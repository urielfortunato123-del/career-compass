import { useState, useCallback } from "react";
import { extractTextFromPDF, OCRProgress, isValidPDF } from "@/lib/pdf-ocr";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ParsedResume {
  id: string;
  text: string;
  isScanned: boolean;
  pageCount: number;
  ocrConfidence?: number;
  structuredData?: Record<string, unknown>;
  filePath?: string;
}

export function usePDFParser() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [result, setResult] = useState<ParsedResume | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const parseResume = useCallback(async (file: File): Promise<ParsedResume | null> => {
    if (!isValidPDF(file)) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie um arquivo PDF.",
        variant: "destructive",
      });
      return null;
    }

    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para enviar seu currículo.",
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

      // Step 2: Upload PDF to Storage
      setProgress({
        stage: "complete",
        progress: 70,
        message: "Enviando arquivo...",
      });

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        // Continue anyway - we have the text
      }

      // Step 3: Send to AI for structured parsing
      setProgress({
        stage: "complete",
        progress: 85,
        message: "Analisando conteúdo com IA...",
      });

      const { data: structuredData, error: parseError } = await supabase.functions.invoke("parse-resume", {
        body: { text: ocrResult.text },
      });

      if (parseError) {
        console.error("Parse error:", parseError);
        toast({
          title: "Aviso",
          description: "Texto extraído, mas análise de IA falhou. Dados básicos salvos.",
          variant: "default",
        });
      }

      // Step 4: Save to database
      setProgress({
        stage: "complete",
        progress: 95,
        message: "Salvando currículo...",
      });

      const resumeData = {
        user_id: user.id,
        file_path: uploadError ? null : fileName,
        raw_text: ocrResult.text,
        is_scanned: ocrResult.isScanned,
        ocr_processed: ocrResult.isScanned,
        summary: structuredData?.summary || null,
        experiences: structuredData?.experiences || [],
        education: structuredData?.education || [],
        courses: structuredData?.courses || [],
        projects: structuredData?.projects || [],
        languages: structuredData?.languages || [],
        technical_skills: structuredData?.technical_skills || [],
        soft_skills: structuredData?.soft_skills || [],
        structured_data: structuredData || null,
      };

      const { data: savedResume, error: saveError } = await supabase
        .from("resumes")
        .insert(resumeData)
        .select()
        .single();

      if (saveError) {
        console.error("Save error:", saveError);
        toast({
          title: "Erro ao salvar",
          description: "O currículo foi processado mas não foi salvo. Tente novamente.",
          variant: "destructive",
        });
        setLoading(false);
        return null;
      }

      // Step 5: Update profile usage
      await supabase
        .from("profiles")
        .update({
          monthly_uploads_used: (await supabase
            .from("profiles")
            .select("monthly_uploads_used")
            .eq("id", user.id)
            .single()
          ).data?.monthly_uploads_used + 1 || 1,
        })
        .eq("id", user.id);

      toast({
        title: ocrResult.isScanned ? "OCR concluído!" : "Currículo processado!",
        description: `${ocrResult.pageCount} página(s) analisada(s) e dados extraídos com sucesso.`,
      });

      const parsedResult: ParsedResume = {
        id: savedResume.id,
        text: ocrResult.text,
        isScanned: ocrResult.isScanned,
        pageCount: ocrResult.pageCount,
        ocrConfidence: ocrResult.ocrConfidence,
        structuredData: structuredData || undefined,
        filePath: uploadError ? undefined : fileName,
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
  }, [toast, user]);

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
