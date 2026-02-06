import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

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

    const userMessage = description 
      ? `Analise esta vaga:\n\n${description}`
      : `Analise uma vaga para o cargo: ${title}${area ? ` na área de ${area}` : ''}`;

    const aiResponse = await callAIWithRace({
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      temperature: 0.3,
      maxTokens: 4000,
      timeoutMs: 30000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);
    
    const analysis = extractJSON(aiResponse.content);

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
