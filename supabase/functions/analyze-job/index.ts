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

    // All models run in parallel - first response wins
    const models = [
      "openai/gpt-oss-120b:free",
      "mistralai/mistral-small-3.1-24b-instruct:free",
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "xiaomi/mimo-v2-flash",
      "deepseek/deepseek-r1-0528:free"
    ];
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    let data;
    const startTime = Date.now();
    
    try {
      // Race all models - first successful response wins
      const fetchPromises = models.map(async (model) => {
        console.log(`Starting model: ${model}`);
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
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${model} failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`Success with ${model} in ${Date.now() - startTime}ms`);
        return { model, data: result };
      });

      // First successful response wins
      const winner = await Promise.any(fetchPromises);
      data = winner.data;
      console.log(`Winner: ${winner.model}`);
      clearTimeout(timeoutId);
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
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
