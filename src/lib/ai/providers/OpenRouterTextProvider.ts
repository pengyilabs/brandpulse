import { TextGenerationProvider, TextGenerationOptions } from './TextGenerationProvider';

const DEFAULT_MODEL = 'deepseek/deepseek-v4-flash';

export class OpenRouterTextProvider implements TextGenerationProvider {
  private edgeFunctionUrl: string;
  private model: string;

  constructor(edgeFunctionUrl: string, model: string = DEFAULT_MODEL) {
    this.edgeFunctionUrl = edgeFunctionUrl;
    this.model = model;
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<string> {
    const response = await fetch(this.edgeFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chat',
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: options?.maxTokens ?? 4096,
        temperature: options?.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Text generation failed: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  }
}