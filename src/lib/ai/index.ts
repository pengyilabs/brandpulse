import { TextGenerationProvider } from './providers/TextGenerationProvider';
import { ImageGenerationProvider } from './providers/ImageGenerationProvider';
import { OpenRouterTextProvider } from './providers/OpenRouterTextProvider';
import { OpenRouterImageProvider } from './providers/OpenRouterImageProvider';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`
  : '';

let textProvider: TextGenerationProvider | null = null;
let imageProvider: ImageGenerationProvider | null = null;

export function getTextProvider(): TextGenerationProvider {
  if (!textProvider) {
    textProvider = new OpenRouterTextProvider(EDGE_FUNCTION_URL);
  }
  return textProvider;
}

export function getImageProvider(): ImageGenerationProvider {
  if (!imageProvider) {
    imageProvider = new OpenRouterImageProvider(EDGE_FUNCTION_URL);
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