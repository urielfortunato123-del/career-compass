import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em planejamento de carreira e desenvolvimento profissional.

GERE UM PLANO DE AÇÃO PRÁTICO E REALISTA baseado no score e lacunas identificadas.

TIPOS DE ATIVIDADES:
- course: Cursos curtos e práticos (indicar duração em horas)
- project: Projetos de portfólio (indicar complexidade)
- application: Candidaturas estratégicas
- interview: Preparação para entrevistas

REGRAS:
- Ações devem ser específicas e mensuráveis
- Cursos devem ser curtos (4-20 horas) e focados
- Projetos devem ser mínimos viáveis (MVP)
- Candidaturas devem ter meta semanal realista
- Distribuir atividades por semana de forma equilibrada

SAÍDA (JSON):
{
  "period": "14|30|90",
  "summary": "resumo do plano",
  "weekly_hours_required": número estimado de horas/semana,
  "items": [
    {
      "id": "uuid",
      "title": "título curto",
      "description": "descrição detalhada",
      "type": "course|project|application|interview",
      "week": número da semana,
      "estimated_hours": horas estimadas,
      "priority": "high|medium|low",
      "resources": ["links ou recursos sugeridos"]
    }
  ],
  "milestones": [
    {
      "week": número,
      "description": "marco a ser atingido"
    }
  ],
  "expected_outcome": "resultado esperado ao final do plano"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      score, 
      improvement_actions, 
      period = "30",
      daily_availability_hours = 2,
      career_transition = false,
      target_area
    } = await req.json();
    
    if (!score && !improvement_actions) {
      return new Response(
        JSON.stringify({ error: "Score ou ações de melhoria são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = `Gere um plano de ação de ${period} dias para este candidato:

SCORE ATUAL: ${score || 'Não calculado'}

AÇÕES DE MELHORIA IDENTIFICADAS:
${JSON.stringify(improvement_actions || [], null, 2)}

DISPONIBILIDADE: ${daily_availability_hours} horas por dia

${career_transition ? `TRANSIÇÃO DE CARREIRA: Sim, para ${target_area || 'nova área'}` : ''}

Gere um plano detalhado e realista para o período de ${period} dias.`;

    const aiResponse = await callAIWithRace({
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      temperature: 0.4,
      maxTokens: 4000,
      timeoutMs: 30000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);
    
    const result = extractJSON(aiResponse.content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("action-plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao gerar plano de ação" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
