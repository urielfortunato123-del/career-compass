import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const userMessage = `Gere um plano de ação de ${period} dias para este candidato:

SCORE ATUAL: ${score || 'Não calculado'}

AÇÕES DE MELHORIA IDENTIFICADAS:
${JSON.stringify(improvement_actions || [], null, 2)}

DISPONIBILIDADE: ${daily_availability_hours} horas por dia

${career_transition ? `TRANSIÇÃO DE CARREIRA: Sim, para ${target_area || 'nova área'}` : ''}

Gere um plano detalhado e realista para o período de ${period} dias.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vagajusta.app",
        "X-Title": "VagaJusta",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to generate action plan");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse action plan");
    }

    const result = JSON.parse(jsonMatch[0]);

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
