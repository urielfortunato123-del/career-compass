import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callAIWithRace, extractJSON } from "../_shared/ai-models.ts";

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

    const userMessage = `Extraia os dados deste currículo:

${text.substring(0, 15000)}`; // Limit text to prevent token overflow

    const aiResponse = await callAIWithRace({
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      temperature: 0.1,
      maxTokens: 4000,
      timeoutMs: 30000,
    });

    console.log(`Response from ${aiResponse.model} in ${aiResponse.responseTimeMs}ms`);
    
    const result = extractJSON(aiResponse.content);
    console.log("Resume parsed successfully - found", (result as any).technical_skills?.length || 0, "skills");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("parse-resume error:", error);
    
    if (error instanceof Error && error.message.includes("timeout")) {
      return new Response(
        JSON.stringify({ error: "Tempo limite excedido. Tente com um currículo menor." }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao processar currículo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
