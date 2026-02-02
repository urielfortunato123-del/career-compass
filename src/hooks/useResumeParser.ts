import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface ResumeData {
  name: string;
  email?: string;
  summary?: string;
  experiences: Array<{
    company: string;
    role: string;
    start_date: string;
    end_date: string | null;
    activities: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string | null;
  }>;
  courses: Array<{
    name: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  technical_skills: string[];
  soft_skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
  is_likely_ocr: boolean;
  extraction_confidence: string;
}

export function useResumeParser() {
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  const parseResume = async (text: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { text },
      });

      if (error) throw error;

      setParsedData(data);
      
      if (data.is_likely_ocr) {
        toast({
          title: 'Currículo processado via OCR',
          description: 'Detectamos que seu PDF pode ser escaneado. Verifique os dados extraídos.',
        });
      }

      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar currículo';
      toast({
        title: 'Erro no processamento',
        description: message,
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (resumeData: {
    user_id: string;
    file_path?: string;
    raw_text?: string;
    summary?: string;
    experiences?: Json;
    education?: Json;
    courses?: Json;
    projects?: Json;
    languages?: Json;
    technical_skills?: string[];
    soft_skills?: string[];
    is_scanned?: boolean;
    ocr_processed?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([resumeData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    loading,
    parsedData,
    parseResume,
    saveResume,
    clearData: () => setParsedData(null),
  };
}
