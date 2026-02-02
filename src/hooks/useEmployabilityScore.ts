import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScoreBreakdown {
  technical_adherence: number;
  seniority_match: number;
  ats_keywords: number;
  resume_structure: number;
}

interface ImprovementAction {
  priority: number;
  action: string;
  impact: 'high' | 'medium' | 'low';
  type: 'skill' | 'course' | 'project' | 'experience';
}

interface EmployabilityScoreResult {
  score: number;
  potential_score: number;
  breakdown: ScoreBreakdown;
  current_range: string;
  optimized_range: string;
  improvement_actions: ImprovementAction[];
  missing_skills: string[];
  strong_points: string[];
}

export function useEmployabilityScore() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmployabilityScoreResult | null>(null);
  const { toast } = useToast();

  const calculateScore = async (params: {
    resume: Record<string, unknown>;
    job?: Record<string, unknown>;
    career_transition?: boolean;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('employability-score', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao calcular score';
      toast({
        title: 'Erro no cálculo',
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
    calculateScore,
    clearResult: () => setResult(null),
  };
}
