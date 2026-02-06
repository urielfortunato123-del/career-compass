import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em recrutamento, triagem ATS e escrita profissional objetiva.

REGRAS ABSOLUTAS:
❌ Não inventar experiências, cargos ou habilidades
❌ Não exagerar senioridade
❌ Não usar linguagem genérica ("proativo", "dinâmico", "trabalho em equipe")
✅ Reescrever com clareza, métricas quando existirem e foco em resultado
✅ Adaptar o currículo à vaga informada
✅ Manter formato ATS-friendly

ESTRUTURA DO CURRÍCULO ATS:
1. TÍTULO PROFISSIONAL: [Cargo] | [X anos de experiência]
2. RESUMO PROFISSIONAL: 3-4 linhas objetivas com especialização e resultados
3. EXPERIÊNCIAS: Formato "Cargo | Empresa | Período" com bullets focados em resultado
4. SKILLS: Organizadas por relevância para a vaga
5. FORMAÇÃO E CERTIFICAÇÕES

SAÍDA (JSON):
{
  "base_resume": "currículo ATS otimizado em markdown",
  "targeted_resume": "currículo direcionado para a vaga (se job foi informado)",
  "keywords_used": ["lista de palavras-chave ATS inseridas"],
  "changes_made": ["lista de mudanças realizadas"],
  "professional_title": "título profissional sugerido"
}`;

const TRANSITION_ADDITIONS = `

MODO TRANSIÇÃO DE CARREIRA:
- Use título híbrido: "[Área Atual] em transição para [Nova Área]"
- Traduza experiências anteriores para linguagem da nova área
- Priorize projetos pessoais e cursos relevantes
- Reduza peso de cargos antigos não relacionados
- Destaque skills transferíveis`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      resume, 
      job, 
      career_transition = false, 
      target_area 
    } = await req.json();
    
    if (!resume) {
      return new Response(
        JSON.stringify({ error: "Dados do currículo são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = career_transition 
      ? SYSTEM_PROMPT + TRANSITION_ADDITIONS 
      : SYSTEM_PROMPT;

    let userMessage = `Gere um currículo ATS otimizado baseado nestes dados:

CURRÍCULO ORIGINAL:
${JSON.stringify(resume, null, 2)}`;

    if (job) {
      userMessage += `

VAGA ALVO:
Título: ${job.title}
Área: ${job.area || 'Não especificada'}
Skills obrigatórias: ${job.mandatory_skills?.join(', ') || 'Não especificadas'}
Skills desejáveis: ${job.optional_skills?.join(', ') || 'Não especificadas'}
Palavras-chave ATS: ${job.ats_keywords?.join(', ') || 'Não especificadas'}`;
    }

    if (career_transition && target_area) {
      userMessage += `

TRANSIÇÃO DE CARREIRA:
O candidato está em transição para a área de: ${target_area}
Aplique as regras de transição de carreira.`;
    }

    const aiResponse = await callAIWithRace({
      systemPrompt,
      userMessage,
      temperature: 0.4,
      maxTokens: 6000,
      timeoutMs: 30000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);
    
    const result = extractJSON(aiResponse.content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-ats-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao gerar currículo ATS" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
