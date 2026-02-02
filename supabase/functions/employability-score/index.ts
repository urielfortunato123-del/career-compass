import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em empregabilidade e análise de compatibilidade candidato-vaga.

CALCULE O SCORE DE EMPREGABILIDADE (0-100) baseado em:

1. ADERÊNCIA TÉCNICA (40% do peso):
- Match entre skills do candidato e skills obrigatórias da vaga
- Cada skill obrigatória faltando = -10 pontos
- Skills extras relevantes = +5 pontos (máx 15)

2. ADERÊNCIA DE SENIORIDADE (25% do peso):
- Match exato = 100%
- 1 nível abaixo = 60%
- 1 nível acima = 80%
- 2+ níveis de diferença = 30%

3. PALAVRAS-CHAVE ATS (20% do peso):
- Proporção de keywords da vaga presentes no currículo
- Keywords em experiências recentes = peso 1.5x

4. ESTRUTURA DO CURRÍCULO (15% do peso):
- Formato limpo e objetivo = 100%
- Muitos parágrafos longos = 60%
- Sem métricas/resultados = 70%

ESTIMATIVA DE TEMPO PARA CONTRATAÇÃO:
- Score 80-100: 2-6 semanas (Rápido 🚀)
- Score 60-79: 2-4 meses (Médio ⚖️)
- Score 40-59: 4-9 meses (Longo 🐢)
- Score <40: 6-12 meses (Muito longo - considere capacitação)

SAÍDA (JSON):
{
  "score": 0-100,
  "potential_score": score possível após melhorias,
  "breakdown": {
    "technical_adherence": 0-100,
    "seniority_match": 0-100,
    "ats_keywords": 0-100,
    "resume_structure": 0-100
  },
  "current_range": "X-Y meses",
  "optimized_range": "X-Y semanas/meses",
  "improvement_actions": [
    {
      "priority": 1,
      "action": "descrição da ação",
      "impact": "high|medium|low",
      "type": "skill|course|project|experience"
    }
  ],
  "missing_skills": ["skills faltantes"],
  "strong_points": ["pontos fortes"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, job, career_transition = false } = await req.json();
    
    if (!resume) {
      return new Response(
        JSON.stringify({ error: "Dados do currículo são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    let userMessage = `Calcule o score de empregabilidade para este candidato:

CURRÍCULO:
${JSON.stringify(resume, null, 2)}`;

    if (job) {
      userMessage += `

VAGA ALVO:
${JSON.stringify(job, null, 2)}`;
    } else {
      userMessage += `

Sem vaga específica - calcule um score geral de empregabilidade para a área do candidato.`;
    }

    if (career_transition) {
      userMessage += `

NOTA: O candidato está em transição de carreira. Considere:
- Skills transferíveis têm mais peso
- Projetos pessoais/estudos recentes são relevantes
- Experiência anterior pode não ser diretamente aplicável`;
    }

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
        temperature: 0.2,
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
      
      throw new Error("Failed to calculate employability score");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse employability score");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("employability-score error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao calcular score" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
