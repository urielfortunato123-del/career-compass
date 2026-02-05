import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em entrevistas técnicas e comportamentais.

GERE 5 PERGUNTAS PROVÁVEIS para esta vaga, com respostas modelo e erros comuns.

TIPOS DE PERGUNTAS:
- 3 técnicas (sobre skills e experiência)
- 2 comportamentais (situacionais, STAR method)

PARA CADA PERGUNTA:
- Pergunta clara e direta
- Resposta modelo objetiva (não genérica)
- 2-3 erros comuns que candidatos cometem
- Dica de como se destacar

SAÍDA (JSON):
{
  "questions": [
    {
      "id": "uuid",
      "question": "pergunta",
      "type": "technical|behavioral",
      "why_asked": "por que essa pergunta é feita",
      "model_answer": "resposta modelo",
      "common_mistakes": ["erro comum 1", "erro comum 2"],
      "pro_tip": "dica para se destacar",
      "follow_up_questions": ["possíveis perguntas de follow-up"]
    }
  ],
  "general_tips": ["dicas gerais para a entrevista"],
  "red_flags_to_avoid": ["comportamentos a evitar"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { job, resume } = await req.json();
    
    if (!job) {
      return new Response(
        JSON.stringify({ error: "Dados da vaga são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    let userMessage = `Gere 5 perguntas de entrevista para esta vaga:

VAGA:
Título: ${job.title}
Área: ${job.area || 'Não especificada'}
Skills obrigatórias: ${job.mandatory_skills?.join(', ') || 'Não especificadas'}
Senioridade: ${job.seniority || 'Não especificada'}`;

    if (resume) {
      userMessage += `

PERFIL DO CANDIDATO:
Experiência: ${resume.experiences?.length || 0} posições anteriores
Skills: ${resume.technical_skills?.join(', ') || 'Não informadas'}

Personalize as perguntas considerando possíveis lacunas entre o perfil e a vaga.`;
    }

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
            temperature: 0.5,
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
      throw new Error("Failed to generate interview questions - all models failed");
    }

    const content = data.choices?.[0]?.message?.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse interview simulation");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("interview-simulator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao gerar simulação" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
