export interface TextGenerationOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface TextGenerationProvider {
  generateText(prompt: string, options?: TextGenerationOptions): Promise<string>;
}