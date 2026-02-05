import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em reescrita de currículos e otimização para sistemas ATS.

OBJETIVO: Melhorar o currículo para atingir PELO MENOS 95% de compatibilidade com a área/cargo desejado.

REGRAS:
✅ Reescrever experiências com foco em RESULTADOS e MÉTRICAS
✅ Adicionar palavras-chave ATS relevantes para a área
✅ Melhorar a estrutura para formato de 1 página
✅ Usar verbos de ação no passado
✅ Destacar skills transferíveis se for transição de carreira
✅ Criar um resumo profissional impactante
❌ NÃO inventar experiências ou mentir
❌ NÃO exagerar cargos ou responsabilidades

SAÍDA (JSON):
{
  "improved_resume": "currículo melhorado em markdown",
  "score_before": número estimado de compatibilidade atual,
  "score_after": número esperado após melhorias (mínimo 95),
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, target_role, target_area, additional_details } = await req.json();
    
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

    const userMessage = `Melhore este currículo para atingir 95%+ de compatibilidade:

CURRÍCULO ATUAL:
${JSON.stringify(resume, null, 2)}

CARGO DESEJADO: ${target_role || "Não especificado"}
ÁREA: ${target_area || "Não especificada"}

DETALHES ADICIONAIS DO USUÁRIO:
${additional_details || "Nenhum detalhe adicional fornecido"}

Analise o currículo e faça TODAS as melhorias necessárias para atingir no mínimo 95% de compatibilidade.`;

    // Models with fallback
    const models = ["nvidia/nemotron-3-nano-30b-a3b:free", "xiaomi/mimo-v2-flash"];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let data;
    try {
      const startTime = Date.now();
      
      for (const model of models) {
        console.log(`Trying model: ${model}`);
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
            max_tokens: 6000,
          }),
          signal: controller.signal,
        });

        if (response.ok) {
          data = await response.json();
          console.log(`Success with ${model} in ${Date.now() - startTime}ms`);
          break;
        }
        console.error(`${model} failed:`, response.status);
      }

      if (!data) {
        throw new Error("All models failed");
      }

      clearTimeout(timeoutId);
      const content = data.choices?.[0]?.message?.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse resume improvement");
    }

      const result = JSON.parse(jsonMatch[0]);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({ error: "Tempo limite excedido. Tente novamente." }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("improve-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao melhorar currículo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
