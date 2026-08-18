export interface ImageGenerationOptions {
  n?: number;
  size?: string;
}

export interface ImageGenerationResult {
  url: string;
  width: number;
  height: number;
}

export interface ImageGenerationProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
}