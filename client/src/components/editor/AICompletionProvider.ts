import * as monaco from 'monaco-editor';
import { AIProviderService } from '../ai/providers';
import { useAIStore } from '../../store/aiStore';

let lastTriggerTime = 0;

export function createAIInlineCompletionProvider(language: string): monaco.languages.InlineCompletionsProvider {
  return {
    async provideInlineCompletions(model, position, context, token) {
      const now = Date.now();
      if (now - lastTriggerTime < 300) {
        return { items: [] };
      }
      lastTriggerTime = now;

      const { provider, getApiKey } = useAIStore.getState();
      const apiKey = getApiKey(provider);

      if (!apiKey) {
        return { items: [] };
      }

      // Context: 200 lines before, 50 lines after
      const startLine = Math.max(1, position.lineNumber - 200);
      const endLine = Math.min(model.getLineCount(), position.lineNumber + 50);

      const prefix = model.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const suffix = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: endLine,
        endColumn: model.getLineMaxColumn(endLine),
      });

      if (!prefix.trim()) {
        return { items: [] };
      }

      const completionText = await AIProviderService.getCompletion(
        provider,
        apiKey,
        prefix,
        suffix,
        language
      );

      if (!completionText || token.isCancellationRequested) {
        return { items: [] };
      }

      return {
        items: [
          {
            insertText: completionText,
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
        ],
      };
    },
    freeInlineCompletions() {},
  };
}
