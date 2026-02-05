import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
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
              { role: "system", content: systemPrompt },
              { role: "user", content },
            ],
            temperature: 0.2,
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

    const translatedContent = data.choices?.[0]?.message?.content;
    
    if (!translatedContent) {
      throw new Error("Empty response from AI");
    }

    return new Response(
      JSON.stringify({ translatedContent }),
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
