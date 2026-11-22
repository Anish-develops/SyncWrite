import { AIProvider, ReviewComment } from '@syncwrite/shared';
import { getOpenAICompletion, getOpenAIReview } from './openai';
import { getGeminiCompletion, getGeminiReview } from './gemini';
import { getAnthropicCompletion, getAnthropicReview } from './anthropic';

export const AIProviderService = {
  async getCompletion(
    provider: AIProvider,
    apiKey: string,
    prefix: string,
    suffix: string,
    language: string
  ): Promise<string> {
    if (!apiKey) return '';

    try {
      if (provider === 'openai') {
        return await getOpenAICompletion(apiKey, prefix, suffix, language);
      } else if (provider === 'gemini') {
        return await getGeminiCompletion(apiKey, prefix, suffix, language);
      } else if (provider === 'anthropic') {
        return await getAnthropicCompletion(apiKey, prefix, suffix, language);
      }
    } catch (err) {
      console.warn('AI autocomplete error:', err);
    }
    return '';
  },

  async getReview(
    provider: AIProvider,
    apiKey: string,
    code: string,
    language: string
  ): Promise<ReviewComment[]> {
    if (!apiKey) {
      throw new Error('API key not set for provider: ' + provider);
    }

    if (provider === 'openai') {
      return getOpenAIReview(apiKey, code, language);
    } else if (provider === 'gemini') {
      return getGeminiReview(apiKey, code, language);
    } else if (provider === 'anthropic') {
      return getAnthropicReview(apiKey, code, language);
    }

    return [];
  },
};
