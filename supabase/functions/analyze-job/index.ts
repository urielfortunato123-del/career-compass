import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em recrutamento, mercado de trabalho e análise crítica de vagas.

REGRAS ABSOLUTAS:
- Identifique exigências irreais
- Detecte acúmulo de função
- Compare responsabilidades x senioridade
- Sinalize riscos contratuais
- Nunca suavizar sinais de cilada

SAÍDA OBRIGATÓRIA (JSON):
{
  "title": "título identificado da vaga",
  "area": "área de atuação",
  "mandatory_skills": ["lista de skills obrigatórias"],
  "optional_skills": ["lista de skills desejáveis"],
  "seniority": "junior | pleno | senior",
  "risk_flags": ["lista de riscos identificados"],
  "fairness_level": "green | yellow | red",
  "ats_keywords": ["palavras-chave para ATS"],
  "analysis_summary": "resumo direto para o candidato"
}

CRITÉRIOS DE CLASSIFICAÇÃO:
- 🟢 GREEN (Vaga Justa): Requisitos claros, compatíveis com senioridade, sem red flags
- 🟡 YELLOW (Atenção): Alguns requisitos acima do esperado, possível acúmulo de função
- 🔴 RED (Cilada Provável): Exigências absurdas, salário incompatível, múltiplas funções

SINAIS DE RISCO:
- "Ambiente de startup" = possível sobrecarga
- "Multitarefa" = acúmulo de função
- "Salário a combinar" + muitos requisitos = cilada
- Senioridade baixa + muita responsabilidade
- Muitas tecnologias diferentes = função indefinida`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, title, area } = await req.json();
    
    if (!description && !title) {
      return new Response(
        JSON.stringify({ error: "Descrição ou título da vaga é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const userMessage = description 
      ? `Analise esta vaga:\n\n${description}`
      : `Analise uma vaga para o cargo: ${title}${area ? ` na área de ${area}` : ''}`;

    const models = [
      "google/gemini-2.0-flash-001",
      "zhipu/glm-4.5-flash-250414"
    ];

    let data;
    let lastError: { status: number; text: string } | null = null;

    for (const model of models) {
      console.log(`Trying model: ${model}`);
      
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vagajusta.app",
            "X-Title": "VagaJusta",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          data = await response.json();
          console.log(`Success with model: ${model}`);
          break;
        }

        const errorText = await response.text();
        console.error(`Model ${model} failed:`, response.status, errorText);
        lastError = { status: response.status, text: errorText };

        // Continue to next model on errors
      } catch (err) {
        console.error(`Model ${model} exception:`, err);
        lastError = { status: 0, text: String(err) };
      }
    }

    if (!data) {
      if (lastError?.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to analyze job - all models failed");
    }

    const content = data.choices?.[0]?.message?.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse job analysis");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-job error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao analisar vaga" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
