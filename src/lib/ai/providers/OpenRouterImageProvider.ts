import { ImageGenerationProvider, ImageGenerationOptions, ImageGenerationResult } from './ImageGenerationProvider';

const DEFAULT_MODEL = 'black-forest-labs/flux-1.1-pro';

export class OpenRouterImageProvider implements ImageGenerationProvider {
  private edgeFunctionUrl: string;
  private model: string;

  constructor(edgeFunctionUrl: string, model: string = DEFAULT_MODEL) {
    this.edgeFunctionUrl = edgeFunctionUrl;
    this.model = model;
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const response = await fetch(this.edgeFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'image',
        model: this.model,
        prompt,
        n: options?.n ?? 1,
        size: options?.size ?? '1024x1024',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Image generation failed: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    const imageData = data.data?.[0];

    if (!imageData?.url) {
      throw new Error('No image URL returned from provider');
    }

    // Parse dimensions from the size string or use defaults
    const size = options?.size ?? '1024x1024';
    const [width, height] = size.split('x').map(Number);

    return {
      url: imageData.url,
      width: width || 1024,
      height: height || 1024,
    };
  }
}