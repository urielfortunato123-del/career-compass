import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um especialista em extração de dados de currículos.

EXTRAIA AS INFORMAÇÕES DO CURRÍCULO e estruture em JSON.

REGRAS CRÍTICAS:
❌ NUNCA inferir ou inventar informações que não estejam explícitas
❌ NUNCA adicionar skills que não foram mencionadas
✅ Se um campo não for encontrado, deixe vazio ou null
✅ Datas devem estar no formato YYYY-MM
✅ Identifique se o texto parece vir de OCR (erros de digitação, formatação quebrada)

SAÍDA (JSON):
{
  "name": "nome completo",
  "email": "email se encontrado",
  "phone": "telefone se encontrado",
  "location": "cidade/estado se encontrado",
  "summary": "resumo profissional (extrair literal, não inventar)",
  "current_role": "cargo atual",
  "experiences": [
    {
      "company": "nome da empresa",
      "role": "cargo",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM ou null se atual",
      "activities": ["lista de atividades/responsabilidades"]
    }
  ],
  "education": [
    {
      "institution": "nome da instituição",
      "degree": "grau (graduação, pós, etc)",
      "field": "área de estudo",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM"
    }
  ],
  "courses": [
    {
      "name": "nome do curso",
      "institution": "instituição",
      "year": "YYYY"
    }
  ],
  "projects": [
    {
      "name": "nome do projeto",
      "description": "descrição",
      "technologies": ["tecnologias usadas"],
      "url": "link se disponível"
    }
  ],
  "technical_skills": ["lista de skills técnicas mencionadas"],
  "soft_skills": ["lista de skills comportamentais mencionadas"],
  "languages": [
    {
      "language": "idioma",
      "level": "nível"
    }
  ],
  "certifications": ["certificações mencionadas"],
  "is_likely_ocr": true/false,
  "extraction_confidence": "high|medium|low",
  "extraction_notes": ["observações sobre a extração"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Texto do currículo muito curto ou vazio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const userMessage = `Extraia os dados deste currículo:

${text.substring(0, 15000)}`; // Limit text to prevent token overflow

    // Use fastest model with timeout for speed
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      console.log("Starting parse with gemini-2.0-flash-001");
      const startTime = Date.now();
      
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
          temperature: 0.1,
          max_tokens: 4000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`API call took ${Date.now() - startTime}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Model failed:", response.status, errorText);
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from AI");
    }
    
    // Parse JSON from response - handle markdown code blocks
    let jsonStr = content;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }
    
    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to extract JSON from response:", content.substring(0, 500));
      throw new Error("Failed to parse resume extraction - no JSON found");
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, jsonMatch[0].substring(0, 500));
      throw new Error("Failed to parse resume extraction - invalid JSON");
    }

      console.log("Resume parsed successfully - found", result.technical_skills?.length || 0, "skills");

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({ error: "Tempo limite excedido. Tente com um currículo menor." }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("parse-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao processar currículo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
