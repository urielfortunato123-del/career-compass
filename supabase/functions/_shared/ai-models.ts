// Shared AI model configuration for all edge functions
// Primary: Gemini 2.0 Flash | Fallback: Gemma 3 27B (free)

export const PRIMARY_MODEL = "google/gemini-2.0-flash-001";
export const FALLBACK_MODEL = "google/gemma-3-27b-it:free";
export const DEFAULT_TIMEOUT_MS = 20000;

export interface AIRequestConfig {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

// Try primary model first, fallback to secondary if it fails
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

  // Try Gemini first
  const geminiResult = await tryModel(PRIMARY_MODEL, config, OPENROUTER_API_KEY, startTime);
  if (geminiResult) {
    return geminiResult;
  }

  // Fallback to Gemma 3
  console.log("Gemini failed, trying Gemma 3...");
  const gemmaResult = await tryModel(FALLBACK_MODEL, config, OPENROUTER_API_KEY, startTime);
  if (gemmaResult) {
    return gemmaResult;
  }

  throw new Error("All AI models failed");
}

async function tryModel(
  model: string,
  config: AIRequestConfig,
  apiKey: string,
  startTime: number
): Promise<{ content: string; model: string; responseTimeMs: number } | null> {
  const controller = new AbortController();
  const timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`Trying model: ${model}`);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vagajusta.app",
        "X-Title": "VagaJusta",
      },
      body: JSON.stringify({
        model,
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
      console.error(`${model} error: ${response.status}`, errorText);
      return null;
    }

    const result = await response.json();
    const responseTimeMs = Date.now() - startTime;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`${model}: empty response`);
      return null;
    }

    console.log(`Success with ${model} in ${responseTimeMs}ms`);
    return { content, model, responseTimeMs };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`${model}: timeout`);
    } else {
      console.error(`${model} error:`, error);
    }
    return null;
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
