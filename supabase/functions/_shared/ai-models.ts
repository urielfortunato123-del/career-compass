// Shared AI model configuration for all edge functions
// Using Google Gemini 2.0 Flash directly

export const GEMINI_MODEL = "gemini-2.0-flash";
export const DEFAULT_TIMEOUT_MS = 55000; // 55s to stay under edge function limit

export interface AIRequestConfig {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export async function callAIWithRace(config: AIRequestConfig): Promise<{
  content: string;
  model: string;
  responseTimeMs: number;
}> {
  const startTime = Date.now();
  
  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  const controller = new AbortController();
  const timeoutMs = Math.min(config.timeoutMs || DEFAULT_TIMEOUT_MS, 55000);
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`Calling Google Gemini: ${GEMINI_MODEL} (timeout: ${timeoutMs}ms)`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${config.systemPrompt}\n\n${config.userMessage}` }
              ]
            }
          ],
          generationConfig: {
            temperature: config.temperature ?? 0.2,
            maxOutputTokens: config.maxTokens ?? 4000,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini error: ${response.status}`, errorText);
      
      if (response.status === 429) {
        throw new Error("Limite de requisições excedido. Tente novamente em alguns segundos.");
      }
      if (response.status === 503 || response.status === 500) {
        throw new Error("Serviço temporariamente indisponível. Tente novamente.");
      }
      
      throw new Error(`AI request failed: ${response.status}`);
    }

    const result = await response.json();
    const responseTimeMs = Date.now() - startTime;
    
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("Empty response from Gemini:", JSON.stringify(result));
      throw new Error("Resposta vazia da IA. Tente novamente.");
    }

    console.log(`Success with ${GEMINI_MODEL} in ${responseTimeMs}ms`);
    return {
      content,
      model: GEMINI_MODEL,
      responseTimeMs,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`Timeout after ${timeoutMs}ms`);
      throw new Error("Tempo limite excedido. O servidor está ocupado, tente novamente.");
    }
    throw error;
  }
}

export function extractJSON(content: string): Record<string, unknown> {
  // Remove markdown code blocks if present
  let jsonStr = content;
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1];
  }

  // Extract JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to extract JSON from response:", content.substring(0, 500));
    throw new Error("Falha ao processar resposta da IA");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error("JSON parse error:", parseError, jsonMatch[0].substring(0, 500));
    throw new Error("Falha ao processar resposta da IA - JSON inválido");
  }
}
