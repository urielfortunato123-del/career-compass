import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em recrutamento e mercado de trabalho brasileiro.

OBJETIVO: Fornecer uma lista realista de vagas de emprego baseada no perfil do candidato.

IMPORTANTE: Como você não tem acesso a APIs de vagas em tempo real, você deve:
1. Sugerir empresas REAIS que costumam contratar para esse cargo
2. Indicar faixas salariais REALISTAS do mercado brasileiro
3. Fornecer emails/sites de carreiras REAIS dessas empresas
4. Indicar os melhores sites para buscar essas vagas

SAÍDA (JSON):
{
  "jobs": [
    {
      "title": "título da vaga",
      "company": "nome da empresa real",
      "location": "cidade/estado ou remoto",
      "salary_range": "R$ X.XXX - R$ X.XXX",
      "contact": "email ou link do site de carreiras",
      "description": "breve descrição do que esperar",
      "match_percentage": número de 0-100,
      "tips": "dica específica para essa vaga"
    }
  ],
  "recommended_sites": [
    {
      "name": "nome do site",
      "url": "url do site",
      "specialty": "especialidade do site"
    }
  ],
  "market_insights": {
    "average_salary": "faixa média do mercado",
    "demand_level": "alta/média/baixa",
    "trending_skills": ["skills em alta"],
    "best_cities": ["melhores cidades para a área"]
  },
  "application_tips": ["dicas para candidatura"],
  "interview_preparation": ["dicas de preparação para entrevista"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, target_role, target_area, location_preference, salary_expectation } = await req.json();
    
    if (!target_role && !resume) {
      return new Response(
        JSON.stringify({ error: "Cargo desejado ou currículo são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    let userMessage = `Busque vagas compatíveis para este candidato:

CARGO DESEJADO: ${target_role || "Extrair do currículo"}
ÁREA: ${target_area || "Não especificada"}
PREFERÊNCIA DE LOCAL: ${location_preference || "Qualquer/Remoto"}
EXPECTATIVA SALARIAL: ${salary_expectation || "Mercado"}`;

    if (resume) {
      userMessage += `

PERFIL DO CANDIDATO:
${JSON.stringify(resume, null, 2)}`;
    }

    userMessage += `

Forneça 5-8 oportunidades realistas com empresas brasileiras que costumam contratar para esse perfil.
Inclua links reais de sites de carreiras e faixas salariais do mercado brasileiro.`;

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
      console.error("OpenRouter error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to search jobs");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse job search results");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("search-jobs error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao buscar vagas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
