import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReviewComment } from '@syncwrite/shared';

export async function getGeminiCompletion(
  apiKey: string,
  prefix: string,
  suffix: string,
  language: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a high-speed ${language} autocomplete engine.
Complete the code at the cursor. Only return the completion characters. Do not wrap in markdown or backticks.

Context before cursor:
${prefix}

Context after cursor:
${suffix}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
}

export async function getGeminiReview(
  apiKey: string,
  code: string,
  language: string
): Promise<ReviewComment[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = `Review this ${language} code. Return a JSON array where each object has:
- "line" (number)
- "severity" ("error"|"warning"|"info")
- "message" (string)
- "suggestion" (string)

Code:
${code}`;

  const result = await model.generateContent(prompt);
  try {
    const json = JSON.parse(result.response.text());
    return Array.isArray(json) ? json : (json.comments || []);
  } catch {
    return [];
  }
}
