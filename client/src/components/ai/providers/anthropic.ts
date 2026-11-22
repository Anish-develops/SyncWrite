import apiClient from '../../../api/client';
import { ReviewComment } from '@syncwrite/shared';

export async function getAnthropicCompletion(
  apiKey: string,
  prefix: string,
  suffix: string,
  language: string
): Promise<string> {
  const payload = {
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 150,
    system: `You are an expert ${language} code autocomplete tool. Complete the code. Output ONLY the completion code.`,
    messages: [
      {
        role: 'user',
        content: `Prefix:\n${prefix}\nSuffix:\n${suffix}`,
      },
    ],
  };

  const res = await apiClient.post(
    '/ai/proxy/anthropic',
    { payload },
    { headers: { 'x-api-key': apiKey } }
  );

  return res.data?.content?.[0]?.text || '';
}

export async function getAnthropicReview(
  apiKey: string,
  code: string,
  language: string
): Promise<ReviewComment[]> {
  const payload = {
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1000,
    system: 'You are a code review assistant. Output ONLY a valid JSON array of review comments.',
    messages: [
      {
        role: 'user',
        content: `Review this ${language} code. Return JSON array with: line, severity, message, suggestion.\n\n${code}`,
      },
    ],
  };

  const res = await apiClient.post(
    '/ai/proxy/anthropic',
    { payload },
    { headers: { 'x-api-key': apiKey } }
  );

  try {
    const text = res.data?.content?.[0]?.text || '[]';
    return JSON.parse(text);
  } catch {
    return [];
  }
}
