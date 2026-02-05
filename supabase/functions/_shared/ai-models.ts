// Shared AI model configuration for all edge functions
// Ollama is the PRIMARY model, OpenRouter models are FALLBACK (race condition)

export const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-001",           // Ultra-fast
  "google/gemini-2.5-flash-preview-05-20", // Very fast
  "google/gemma-3n-e2b-it:free",           // New Gemma model
  "zhipu/glm-4.5-flash-250414",            // Fast Chinese model
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "xiaomi/mimo-v2-flash",                   // Fast
  "deepseek/deepseek-r1-0528:free"
] as const;

export const DEFAULT_TIMEOUT_MS = 20000;
export const EXTENDED_TIMEOUT_MS = 25000;
export const OLLAMA_TIMEOUT_MS = 15000; // Faster timeout for Ollama

export interface AIRequestConfig {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  ollamaModel?: string; // Default: "llama3.2" or user preference
}

// Try Ollama first, then fallback to OpenRouter race
export async function callAIWithRace(config: AIRequestConfig): Promise<{
  content: string;
  model: string;
  responseTimeMs: number;
}> {
  const startTime = Date.now();
  
  // Try Ollama first (primary)
  const ollamaResult = await tryOllama(config, startTime);
  if (ollamaResult) {
    return ollamaResult;
  }

  // Fallback to OpenRouter race
  console.log("Ollama failed or unavailable, falling back to OpenRouter...");
  return await callOpenRouterRace(config, startTime);
}

// Ollama primary call
async function tryOllama(config: AIRequestConfig, startTime: number): Promise<{
  content: string;
  model: string;
  responseTimeMs: number;
} | null> {
  const OLLAMA_API_URL = Deno.env.get("OLLAMA_API_URL");
  const OLLAMA_API_KEY = Deno.env.get("OLLAMA_API_KEY");
  
  if (!OLLAMA_API_URL) {
    console.log("OLLAMA_API_URL not configured, skipping Ollama");
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
  const model = config.ollamaModel || "llama3.2";

  try {
    console.log(`Trying Ollama (${model})...`);
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Add API key if configured
    if (OLLAMA_API_KEY) {
      headers["Authorization"] = `Bearer ${OLLAMA_API_KEY}`;
    }

    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: config.userMessage },
        ],
        stream: false,
        options: {
          temperature: config.temperature ?? 0.2,
          num_predict: config.maxTokens ?? 4000,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Ollama failed: ${response.status}`);
      return null;
    }

    const result = await response.json();
    const responseTimeMs = Date.now() - startTime;
    const content = result.message?.content;

    if (!content) {
      console.error("Empty response from Ollama");
      return null;
    }

    console.log(`Success with Ollama (${model}) in ${responseTimeMs}ms`);
    return {
      content,
      model: `ollama/${model}`,
      responseTimeMs,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Ollama timeout");
    } else {
      console.error("Ollama error:", error);
    }
    return null;
  }
}

// OpenRouter fallback with race condition
async function callOpenRouterRace(config: AIRequestConfig, startTime: number): Promise<{
  content: string;
  model: string;
  responseTimeMs: number;
}> {
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchPromises = OPENROUTER_MODELS.map(async (model) => {
      console.log(`Starting OpenRouter model: ${model}`);
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
            { role: "system", content: config.systemPrompt },
            { role: "user", content: config.userMessage },
          ],
          temperature: config.temperature ?? 0.2,
          max_tokens: config.maxTokens ?? 4000,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`${model} failed: ${response.status}`);
      }

      const result = await response.json();
      const responseTimeMs = Date.now() - startTime;
      console.log(`Success with ${model} in ${responseTimeMs}ms`);
      
      return { model, data: result, responseTimeMs };
    });

    const winner = await Promise.any(fetchPromises);
    console.log(`OpenRouter winner: ${winner.model}`);

    const content = winner.data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    return {
      content,
      model: winner.model,
      responseTimeMs: winner.responseTimeMs,
    };
  } finally {
    clearTimeout(timeoutId);
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
