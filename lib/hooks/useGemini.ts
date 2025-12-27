'use client';

import { useState, useCallback } from 'react';

interface UseGeminiOptions {
  model?: string;
}

interface GeminiResponse {
  result: string;
  error?: string;
}

export function useGemini(options: UseGeminiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = useCallback(async (prompt: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'gemini-pro',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data: GeminiResponse = await response.json();
      return data.result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Gemini API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.model]);

  const chat = useCallback(async (
    messages: Array<{ role: 'user' | 'model'; parts: string }>
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: options.model || 'gemini-pro',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data: GeminiResponse = await response.json();
      return data.result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Gemini API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.model]);

  return {
    generateText,
    chat,
    loading,
    error,
  };
}

