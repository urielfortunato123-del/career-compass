import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAME_AREA_PROMPT = `Você é um especialista em reescrita de currículos e otimização para sistemas ATS.

CONTEXTO: O candidato quer MELHORAR seu currículo na MESMA ÁREA de atuação.

OBJETIVO: Otimizar o currículo para atingir PELO MENOS 95% de compatibilidade com vagas similares.

REGRAS:
✅ Reescrever experiências com foco em RESULTADOS e MÉTRICAS quantificáveis
✅ Adicionar palavras-chave ATS relevantes para a área atual
✅ Melhorar a estrutura para formato de 1-2 páginas otimizado
✅ Usar verbos de ação no passado (liderou, implementou, otimizou)
✅ Destacar conquistas e promoções
✅ Criar um resumo profissional impactante
❌ NÃO inventar experiências ou mentir
❌ NÃO exagerar cargos ou responsabilidades

SAÍDA (JSON):
{
  "improved_resume": "currículo melhorado em markdown",
  "score_before": número estimado de compatibilidade atual,
  "score_after": número esperado após melhorias (mínimo 95),
  "is_career_transition": false,
  "transition_analysis": null,
  "improvements": [
    {
      "section": "nome da seção",
      "before": "texto original",
      "after": "texto melhorado",
      "reason": "motivo da mudança"
    }
  ],
  "tips": ["dicas extras para entrevista"],
  "missing_skills": ["skills que poderiam ser adicionadas com cursos"],
  "suggested_courses": ["cursos sugeridos para aumentar competitividade"]
}`;

const CAREER_TRANSITION_PROMPT = `Você é um especialista em TRANSIÇÃO DE CARREIRA e reescrita de currículos para sistemas ATS.

CONTEXTO: O candidato está em TRANSIÇÃO DE CARREIRA para uma NOVA ÁREA. Experiências anteriores em outras áreas geralmente NÃO são relevantes para recrutadores da nova área.

OBJETIVO: Reconstruir o currículo DO ZERO para a nova área, destacando potencial e vontade de aprender.

ANÁLISE OBRIGATÓRIA:
1. Verificar se o candidato JÁ TEM experiência na nova área (mesmo que pequena)
2. Verificar se TEM ou ESTÁ FAZENDO cursos/certificações na nova área
3. Identificar skills TRANSFERÍVEIS que podem ser úteis
4. Determinar o NÍVEL de entrada: Iniciante completo, Iniciante com formação, ou Com alguma experiência

REGRAS DE REESCRITA:
✅ REMOVER ou MINIMIZAR experiências que não agregam valor para a nova área
✅ Se é INICIANTE: usar linguagem como "Profissional em transição de carreira com forte motivação para aprender"
✅ Se TEM CURSOS: destacar formação e projetos práticos como experiência
✅ CRIAR seção "Projetos Pessoais" ou "Estudos em Andamento" se aplicável
✅ Destacar SOFT SKILLS transferíveis (análise, organização, comunicação)
✅ Usar título como: "[Cargo Desejado] em Formação" ou "Aspirante a [Cargo]"
✅ Incluir uma seção "Objetivo" clara sobre a transição
❌ NÃO manter experiências irrelevantes em destaque
❌ NÃO mentir sobre experiência que não tem
❌ NÃO usar linguagem que sugira experiência que não existe

SAÍDA (JSON):
{
  "improved_resume": "currículo RECONSTRUÍDO em markdown para a nova área",
  "score_before": número (provavelmente baixo, pois é transição),
  "score_after": número esperado após reconstrução (focado em perfil iniciante),
  "is_career_transition": true,
  "transition_analysis": {
    "experience_level": "none" | "learning" | "some",
    "has_courses": boolean,
    "courses_found": ["lista de cursos encontrados"],
    "transferable_skills": ["skills que podem ser aproveitadas"],
    "recommended_title": "título sugerido para o cargo",
    "honest_assessment": "avaliação honesta do perfil para a nova área"
  },
  "improvements": [
    {
      "section": "nome da seção",
      "before": "texto original (ou 'Não existia')",
      "after": "texto novo",
      "reason": "motivo da mudança"
    }
  ],
  "tips": ["dicas específicas para iniciantes na área"],
  "missing_skills": ["skills essenciais que precisa desenvolver"],
  "suggested_courses": ["cursos prioritários para entrar na área"],
  "entry_strategy": "estratégia sugerida para conseguir a primeira vaga"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, target_role, target_area, additional_details, career_transition = false } = await req.json();
    
    if (!resume) {
      return new Response(
        JSON.stringify({ error: "Dados do currículo são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = career_transition ? CAREER_TRANSITION_PROMPT : SAME_AREA_PROMPT;

    const userMessage = career_transition 
      ? `RECONSTRUA este currículo para TRANSIÇÃO DE CARREIRA:

CURRÍCULO ATUAL (área diferente da desejada):
${JSON.stringify(resume, null, 2)}

NOVA ÁREA DESEJADA: ${target_area || "Não especificada"}
CARGO ALVO: ${target_role || "Não especificado"}

INFORMAÇÕES ADICIONAIS DO CANDIDATO:
${additional_details || "Nenhum detalhe adicional fornecido"}

IMPORTANTE: 
- Analise se o candidato já tem alguma experiência/curso na nova área
- Se for iniciante completo, monte um currículo honesto focado em potencial
- Remova ou minimize experiências que não agregam valor para a nova área
- Empresas de ${target_area} geralmente não valorizam experiência em outras áreas`

      : `Melhore este currículo para atingir 95%+ de compatibilidade NA MESMA ÁREA:

CURRÍCULO ATUAL:
${JSON.stringify(resume, null, 2)}

CARGO DESEJADO: ${target_role || "Não especificado"}
ÁREA: ${target_area || "Não especificada"}

DETALHES ADICIONAIS DO USUÁRIO:
${additional_details || "Nenhum detalhe adicional fornecido"}

Analise o currículo e faça TODAS as melhorias necessárias para atingir no mínimo 95% de compatibilidade.`;

    // Use shared AI function - Gemini primary, Ollama fallback
    const aiResponse = await callAIWithRace({
      systemPrompt,
      userMessage,
      temperature: 0.4,
      maxTokens: 8000,
      timeoutMs: 25000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);
    
    const result = extractJSON(aiResponse.content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("improve-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao melhorar currículo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
