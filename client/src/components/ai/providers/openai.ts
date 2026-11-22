import OpenAI from 'openai';
import { ReviewComment } from '@syncwrite/shared';

export async function getOpenAICompletion(
  apiKey: string,
  prefix: string,
  suffix: string,
  language: string
): Promise<string> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert ${language} autocomplete engine. Complete the code following the prefix. Only return the raw code completion, no markdown codeblocks, no explanations.`,
      },
      {
        role: 'user',
        content: `Code before cursor:\n${prefix}\n\nCode after cursor:\n${suffix}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content || '';
}

export async function getOpenAIReview(
  apiKey: string,
  code: string,
  language: string
): Promise<ReviewComment[]> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `Review this ${language} code for bugs, performance issues, and best practices.
Return a STRICT JSON array of objects with keys:
- "line": line number (integer)
- "severity": "error" | "warning" | "info"
- "message": short description
- "suggestion": suggested code replacement

Code:
${code}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an automated code review assistant. Output ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content || '{"comments": []}';
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.comments || parsed.reviews || []);
  } catch {
    return [];
  }
}
