import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

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

    const aiResponse = await callAIWithRace({
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      temperature: 0.5,
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
    console.error("interview-simulator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao gerar simulação" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
