import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  title: string;
  company: string;
  location: string;
  salary_range: string;
  contact: string;
  description: string;
  match_percentage: number;
  tips: string;
}

interface RecommendedSite {
  name: string;
  url: string;
  specialty: string;
}

interface MarketInsights {
  average_salary: string;
  demand_level: string;
  trending_skills: string[];
  best_cities: string[];
}

interface SearchJobsResult {
  jobs: Job[];
  recommended_sites: RecommendedSite[];
  market_insights: MarketInsights;
  application_tips: string[];
  interview_preparation: string[];
}

export function useSearchJobs() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchJobsResult | null>(null);
  const { toast } = useToast();

  const searchJobs = async (params: {
    resume?: Record<string, unknown>;
    target_role?: string;
    target_area?: string;
    location_preference?: string;
    salary_expectation?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: 'Vagas encontradas!',
        description: `${data.jobs?.length || 0} oportunidades compatíveis`,
      });

      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar vagas';
      toast({
        title: 'Erro na busca',
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
    searchJobs,
    clearResult: () => setResult(null),
  };
}
