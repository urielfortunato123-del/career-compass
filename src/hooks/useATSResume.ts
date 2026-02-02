import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ATSResumeResult {
  base_resume: string;
  targeted_resume?: string;
  keywords_used: string[];
  changes_made: string[];
  professional_title: string;
}

export function useATSResume() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResumeResult | null>(null);
  const { toast } = useToast();

  const generateATSResume = async (params: {
    resume: Record<string, unknown>;
    job?: Record<string, unknown>;
    career_transition?: boolean;
    target_area?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ats-resume', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: 'Currículo ATS gerado!',
        description: `${data.keywords_used.length} palavras-chave inseridas.`,
      });

      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar currículo';
      toast({
        title: 'Erro na geração',
        description: message,
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    generateATSResume,
    clearResult: () => setResult(null),
  };
}
