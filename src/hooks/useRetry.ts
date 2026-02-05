import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface RetryConfig {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  lastError: Error | null;
}

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  config: RetryConfig = {}
): {
  execute: () => Promise<T | null>;
  state: RetryState;
  reset: () => void;
} {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 1.5,
    onRetry,
  } = config;

  const { toast } = useToast();
  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    lastError: null,
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const execute = useCallback(async (): Promise<T | null> => {
    setState({ isRetrying: true, attempt: 0, lastError: null });

    let lastError: Error | null = null;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt }));
        const result = await asyncFn();
        setState({ isRetrying: false, attempt, lastError: null });
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        setState(prev => ({ ...prev, lastError }));

        if (attempt < maxRetries) {
          onRetry?.(attempt, lastError);
          
          // Check if it's a rate limit error
          const isRateLimit = lastError.message.includes("429") || 
                              lastError.message.toLowerCase().includes("rate limit");
          
          if (isRateLimit) {
            toast({
              title: "Limite de requisições",
              description: `Aguardando ${Math.round(currentDelay / 1000)}s antes de tentar novamente...`,
              variant: "default",
            });
          }

          await sleep(currentDelay);
          currentDelay *= backoffMultiplier;
        }
      }
    }

    setState({ isRetrying: false, attempt: maxRetries, lastError });
    
    toast({
      title: "Erro após múltiplas tentativas",
      description: lastError?.message || "Não foi possível completar a operação",
      variant: "destructive",
    });

    return null;
  }, [asyncFn, maxRetries, delayMs, backoffMultiplier, onRetry, toast]);

  const reset = useCallback(() => {
    setState({ isRetrying: false, attempt: 0, lastError: null });
  }, []);

  return { execute, state, reset };
}

// Helper function for simpler use cases
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= 1.5;
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}
