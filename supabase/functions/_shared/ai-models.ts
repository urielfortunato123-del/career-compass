// Shared AI model configuration for all edge functions
// Using Gemini via OpenRouter only

export const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";
export const DEFAULT_TIMEOUT_MS = 25000;

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
  
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const controller = new AbortController();
  const timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`Calling Gemini: ${OPENROUTER_MODEL}`);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vagajusta.app",
        "X-Title": "VagaJusta",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: config.userMessage },
        ],
        temperature: config.temperature ?? 0.2,
        max_tokens: config.maxTokens ?? 4000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini error: ${response.status}`, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const result = await response.json();
    const responseTimeMs = Date.now() - startTime;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from AI");
    }

    console.log(`Success with ${OPENROUTER_MODEL} in ${responseTimeMs}ms`);
    return {
      content,
      model: OPENROUTER_MODEL,
      responseTimeMs,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - try again");
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
    throw new Error("Failed to parse AI response - no JSON found");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error("JSON parse error:", parseError, jsonMatch[0].substring(0, 500));
    throw new Error("Failed to parse AI response - invalid JSON");
  }
}
