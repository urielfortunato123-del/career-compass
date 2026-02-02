import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PlanPeriod } from '@/types/vagajusta';
import type { Json } from '@/integrations/supabase/types';

interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'project' | 'application' | 'interview';
  week: number;
  estimated_hours: number;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
}

interface ActionPlanResult {
  period: PlanPeriod;
  summary: string;
  weekly_hours_required: number;
  items: ActionPlanItem[];
  milestones: Array<{
    week: number;
    description: string;
  }>;
  expected_outcome: string;
}

export function useActionPlan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionPlanResult | null>(null);
  const { toast } = useToast();

  const generatePlan = async (params: {
    score?: number;
    improvement_actions?: Array<{ action: string; type: string }>;
    period?: PlanPeriod;
    daily_availability_hours?: number;
    career_transition?: boolean;
    target_area?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('action-plan', {
        body: params,
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: 'Plano de ação gerado!',
        description: `Plano de ${data.period} dias com ${data.items.length} atividades.`,
      });

      return { data, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar plano';
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

  const savePlan = async (planData: {
    user_id: string;
    analysis_id?: string;
    period: '14' | '30' | '90';
    items?: Json;
    progress?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('action_plans')
        .insert([{
          user_id: planData.user_id,
          period: planData.period,
          analysis_id: planData.analysis_id,
          items: planData.items,
          progress: planData.progress,
        }])
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
    generatePlan,
    savePlan,
    clearResult: () => setResult(null),
  };
}
