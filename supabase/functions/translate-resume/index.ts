import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace } from "../_shared/ai-models.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, targetLanguage } = await req.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Conteúdo do currículo é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const languageNames: Record<string, string> = {
      en: "English",
      pt: "Portuguese (Brazil)",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      ru: "Russian",
    };

    const targetLangName = languageNames[targetLanguage] || "English";

    const systemPrompt = `You are a professional resume translator. Translate the resume to ${targetLangName}.

RULES:
✅ Maintain the exact same formatting (markdown)
✅ Translate ALL text content
✅ Keep proper nouns (names, company names) unchanged
✅ Adapt job titles to common terms in the target language
✅ Keep technical terms in their commonly used form
❌ DO NOT add or remove any information
❌ DO NOT change the structure

Output ONLY the translated resume, nothing else.`;

    const aiResponse = await callAIWithRace({
      systemPrompt,
      userMessage: content,
      temperature: 0.2,
      maxTokens: 4000,
      timeoutMs: 30000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);

    return new Response(
      JSON.stringify({ translatedContent: aiResponse.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("translate-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao traduzir currículo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
