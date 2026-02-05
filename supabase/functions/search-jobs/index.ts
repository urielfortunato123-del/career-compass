import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista internacional em recrutamento e mercado de trabalho.

OBJETIVO: Fornecer uma lista realista de vagas de emprego baseada no perfil do candidato e na LOCALIZAÇÃO ESPECIFICADA.

IMPORTANTE - LOCALIZAÇÃO:
1. Se o usuário especificar um PAÍS (ex: Brasil, Argentina, EUA, Portugal), busque APENAS vagas nesse país
2. Se especificar uma CIDADE (ex: São Paulo, Lisboa, Buenos Aires), foque nessa cidade/região
3. Se especificar "Qualquer país do mundo" ou "Mundial", sugira vagas REMOTAS INTERNACIONAIS
4. ADAPTE a moeda do salário conforme o país (R$ para Brasil, USD para EUA, EUR para Europa, ARS para Argentina, etc.)
5. Sugira sites de emprego LOCAIS daquele país/região

IMPORTANTE - CONTEÚDO:
1. Sugerir empresas REAIS que costumam contratar para esse cargo NAQUELE PAÍS/REGIÃO
2. Indicar faixas salariais REALISTAS do mercado LOCAL
3. Fornecer emails/sites de carreiras REAIS dessas empresas
4. Indicar os melhores sites para buscar vagas NAQUELE PAÍS

SAÍDA (JSON):
{
  "jobs": [
    {
      "title": "título da vaga",
      "company": "nome da empresa real",
      "location": "cidade/estado/país",
      "salary_range": "faixa salarial na moeda local",
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
    "average_salary": "faixa média do mercado LOCAL na moeda correta",
    "demand_level": "alta/média/baixa",
    "trending_skills": ["skills em alta naquele mercado"],
    "best_cities": ["melhores cidades para a área naquele país"]
  },
  "application_tips": ["dicas para candidatura naquele país"],
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

ATENÇÃO: A localização "${location_preference || "Qualquer/Remoto"}" é OBRIGATÓRIA. 
Todas as vagas DEVEM ser para essa região/país específico.
Adapte a moeda, os sites de emprego e as empresas para esse mercado.

Forneça 5-8 oportunidades realistas com empresas que atuam nessa região.
Inclua links reais de sites de carreiras e faixas salariais do mercado local.`;

    const models = [
      "google/gemini-2.0-flash-001",
      "google/gemini-2.5-flash-preview-05-20",
      "google/gemma-3n-e2b-it:free",
      "zhipu/glm-4.5-flash-250414",
      "xiaomi/mimo-v2-flash"
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
            temperature: 0.4,
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
      throw new Error("Failed to search jobs - all models failed");
    }
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
