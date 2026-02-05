import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Improvement {
  section: string;
  before: string;
  after: string;
  reason: string;
}

interface ImproveResumeResult {
  improved_resume: string;
  score_before: number;
  score_after: number;
  improvements: Improvement[];
  tips: string[];
  missing_skills: string[];
  suggested_courses: string[];
}

export function useImproveResume() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImproveResumeResult | null>(null);
  const { toast } = useToast();

  const improveResume = async (params: {
    resume: Record<string, unknown>;
    target_role?: string;
    target_area?: string;
    additional_details?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('improve-resume', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: 'Currículo melhorado!',
        description: `Score aumentou de ${data.score_before}% para ${data.score_after}%`,
      });

      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao melhorar currículo';
      toast({
        title: 'Erro na melhoria',
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
    improveResume,
    clearResult: () => setResult(null),
  };
}
