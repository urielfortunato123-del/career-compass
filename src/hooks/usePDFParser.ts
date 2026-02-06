import { useState, useCallback } from "react";
import { 
  extractTextFromDocument, 
  ParseProgress, 
  isValidDocument,
  getSupportedFileType 
} from "@/lib/document-parser";
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
  fileType?: "pdf" | "docx" | "doc";
}

export function usePDFParser() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ParseProgress | null>(null);
  const [result, setResult] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const parseResume = useCallback(async (file: File): Promise<ParsedResume | null> => {
    const fileType = getSupportedFileType(file);
    
    if (!fileType) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie um arquivo PDF ou Word (.docx).",
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
    setError(null);

    try {
      // Step 1: Extract text from document (PDF or DOCX, with OCR if needed)
      let parseResult;
      try {
        parseResult = await extractTextFromDocument(file, setProgress);
      } catch (extractError) {
        const errorMessage = extractError instanceof Error 
          ? extractError.message 
          : "Erro ao processar o arquivo";
        
        setError(errorMessage);
        toast({
          title: "Erro no processamento",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
        return null;
      }

      if (!parseResult.text || parseResult.text.length < 50) {
        const errorMsg = `Arquivo ${fileType === 'pdf' ? 'PDF' : 'Word'} vazio ou ilegível. Verifique se o arquivo está correto.`;
        setError(errorMsg);
        toast({
          title: "Documento vazio",
          description: errorMsg,
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

      // Step 3: Send to AI for structured parsing with retry
      setProgress({
        stage: "complete",
        progress: 80,
        message: "Analisando conteúdo com IA...",
      });

      let structuredData = null;
      let aiParseError = null;
      
      // Try up to 2 times
      for (let attempt = 1; attempt <= 2; attempt++) {
        if (attempt > 1) {
          setProgress({
            stage: "complete",
            progress: 82,
            message: "Tentando novamente...",
          });
        }
        
        const { data, error } = await supabase.functions.invoke("parse-resume", {
          body: { text: parseResult.text.substring(0, 12000) }, // Limit text size
        });
        
        if (!error && data) {
          structuredData = data;
          aiParseError = null;
          break;
        }
        
        aiParseError = error;
        console.error(`Parse attempt ${attempt} failed:`, error);
        
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (aiParseError) {
        console.error("All parse attempts failed:", aiParseError);
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
        raw_text: parseResult.text,
        is_scanned: parseResult.isScanned,
        ocr_processed: parseResult.isScanned,
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
        title: parseResult.isScanned ? "OCR concluído!" : "Currículo processado!",
        description: `${parseResult.pageCount} página(s) analisada(s) e dados extraídos com sucesso.`,
      });

      const finalResult: ParsedResume = {
        id: savedResume.id,
        text: parseResult.text,
        isScanned: parseResult.isScanned,
        pageCount: parseResult.pageCount,
        ocrConfidence: parseResult.ocrConfidence,
        structuredData: structuredData || undefined,
        filePath: uploadError ? undefined : fileName,
        fileType: parseResult.fileType,
      };

      setResult(finalResult);
      setProgress({
        stage: "complete",
        progress: 100,
        message: "Processamento completo!",
      });

      return finalResult;
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
