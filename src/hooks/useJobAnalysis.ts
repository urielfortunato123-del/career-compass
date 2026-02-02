import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Job, FairnessLevel } from '@/types/vagajusta';
import { useToast } from '@/hooks/use-toast';

interface JobAnalysisResult {
  title: string;
  area: string;
  mandatory_skills: string[];
  optional_skills: string[];
  seniority: string;
  risk_flags: string[];
  fairness_level: FairnessLevel;
  ats_keywords: string[];
  analysis_summary: string;
}

export function useJobAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeJob = async (params: { description?: string; title?: string; area?: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-job', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao analisar vaga';
      toast({
        title: 'Erro na análise',
        description: message,
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobData: {
    user_id: string;
    title: string;
    company?: string;
    area?: string;
    description?: string;
    mandatory_skills?: string[];
    optional_skills?: string[];
    seniority?: 'junior' | 'pleno' | 'senior';
    risk_flags?: string[];
    fairness_level?: 'green' | 'yellow' | 'red';
    analysis_summary?: string;
    ats_keywords?: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
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
    result,
    analyzeJob,
    saveJob,
    clearResult: () => setResult(null),
  };
}
