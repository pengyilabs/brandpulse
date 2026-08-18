import { TextGenerationProvider } from './providers/TextGenerationProvider';
import { ImageGenerationProvider } from './providers/ImageGenerationProvider';
import { OpenRouterTextProvider } from './providers/OpenRouterTextProvider';
import { OpenRouterImageProvider } from './providers/OpenRouterImageProvider';

// Netlify Function URL — uses relative path so it works in dev and prod
// Local dev with Netlify Dev: http://localhost:8888/.netlify/functions/ai-proxy
// Production: https://brandpulsecn.netlify.app/.netlify/functions/ai-proxy
const PROXY_URL = '/.netlify/functions/ai-proxy';

let textProvider: TextGenerationProvider | null = null;
let imageProvider: ImageGenerationProvider | null = null;

export function getTextProvider(): TextGenerationProvider {
  if (!textProvider) {
    textProvider = new OpenRouterTextProvider(PROXY_URL);
  }
  return textProvider;
}

export function getImageProvider(): ImageGenerationProvider {
  if (!imageProvider) {
    imageProvider = new OpenRouterImageProvider(PROXY_URL);
  }
  return imageProvider;
}

export function setTextProvider(provider: TextGenerationProvider): void {
  textProvider = provider;
}

export function setImageProvider(provider: ImageGenerationProvider): void {
  imageProvider = provider;
}

export type { TextGenerationProvider, TextGenerationOptions } from './providers/TextGenerationProvider';
export type { ImageGenerationProvider, ImageGenerationOptions, ImageGenerationResult } from './providers/ImageGenerationProvider';