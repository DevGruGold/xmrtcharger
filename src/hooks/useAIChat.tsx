import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseAIChatOptions {
  systemPrompt?: string;
  maxTokens?: number;
}

export const useAIChat = (options: UseAIChatOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    messages: Message[]
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages,
          systemPrompt: options.systemPrompt,
          maxTokens: options.maxTokens || 1000,
        }
      });

      if (functionError) {
        console.error('AI Chat Error:', functionError);
        setError(functionError.message || 'Failed to get AI response');
        return null;
      }

      if (!data || !data.message) {
        setError('Invalid response from AI service');
        return null;
      }

      return data.message;
    } catch (err) {
      console.error('Error calling AI chat:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options.systemPrompt, options.maxTokens]);

  return {
    sendMessage,
    isLoading,
    error,
  };
};
