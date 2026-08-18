import { getContentItem, updateContentItem } from './content-items-service';
import { getBrandKit } from './brand-kits-service';
import { getWriterProfile } from './writer-profiles-service';
import { getTextProvider, getImageProvider } from '../ai';
import { buildContentPrompt, buildImagePrompt } from '../ai/prompts/platform-prompts';

export interface GenerationResult {
  success: boolean;
  title?: string;
  description?: string;
  error?: string;
}

/**
 * Generate a full content draft for a content item.
 * Gathers context (brand kit, writer profile, platform specs),
 * builds an AI prompt, generates text, and saves the result.
 */
export async function generateContentDraft(contentItemId: string): Promise<GenerationResult> {
  try {
    // 1. Fetch the content item
    const item = await getContentItem(contentItemId);
    if (!item) {
      return { success: false, error: 'Content item not found' };
    }

    // Set status to generating
    await updateContentItem(contentItemId, { status: 'generating' });

    // 2. Gather context
    const brandKit = item.brand_kit_id ? await getBrandKit(item.brand_kit_id) : null;
    const writerProfile = item.writer_profile_id ? await getWriterProfile(item.writer_profile_id) : null;

    // 3. Build the AI prompt
    const prompt = buildContentPrompt({
      platform: item.platform,
      topic: item.title || item.description || 'Untitled',
      contentType: item.content_type,
      brandKit: brandKit ? { tone_of_voice: brandKit.tone_of_voice } : undefined,
      writerProfile: writerProfile ? {
        style: writerProfile.style,
        tone: writerProfile.tone,
        audience: writerProfile.audience,
        topics: writerProfile.topics,
      } : undefined,
    });

    // 4. Generate text via AI
    const provider = getTextProvider();
    const generatedText = await provider.generateText(prompt);

    // 5. Parse the generated text to extract title and description
    // The AI returns structured text; we extract the first line as title
    const lines = generatedText.trim().split('\n').filter(l => l.trim());
    const generatedTitle = lines[0]?.replace(/^#\s*/, '').replace(/^标题[：:]\s*/i, '').trim() || item.title || '';
    const generatedDescription = lines.slice(1).join('\n').trim() || generatedText;

    // 6. Save the generated content
    await updateContentItem(contentItemId, {
      title: generatedTitle,
      description: generatedDescription,
      status: 'draft',
    });

    return {
      success: true,
      title: generatedTitle,
      description: generatedDescription,
    };
  } catch (error) {
    console.error('Error generating content draft:', error);
    // Revert status to draft so the item isn't stuck in "generating"
    await updateContentItem(contentItemId, { status: 'draft' }).catch(() => {});
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Regenerate a specific field of a content item.
 * Currently supports 'title' and 'description'.
 */
export async function regenerateField(
  contentItemId: string,
  field: 'title' | 'description'
): Promise<GenerationResult> {
  try {
    const item = await getContentItem(contentItemId);
    if (!item) {
      return { success: false, error: 'Content item not found' };
    }

    let prompt: string;
    if (field === 'title') {
      prompt = `请为以下内容生成一个吸引人的标题（${item.platform}平台）：\n\n${item.description || '暂无内容'}\n\n要求：标题简洁有力，符合${item.platform}平台风格。`;
    } else {
      prompt = `请根据以下标题生成详细内容描述（${item.platform}平台）：\n\n标题：${item.title || '无标题'}\n\n请生成适合${item.platform}平台的内容。`;
    }

    const provider = getTextProvider();
    const generatedText = await provider.generateText(prompt);

    const update: Record<string, string> = {};
    if (field === 'title') {
      update.title = generatedText.trim().replace(/^#\s*/, '').replace(/^标题[：:]\s*/i, '').substring(0, 200);
    } else {
      update.description = generatedText.trim();
    }

    await updateContentItem(contentItemId, update as any);

    return { success: true, ...update };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate an image for a content item and save it to resources.
 * Returns the generated image URL.
 */
export async function generateContentImage(
  contentItemId: string,
  customPrompt?: string
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const item = await getContentItem(contentItemId);
    if (!item) {
      return { success: false, error: 'Content item not found' };
    }

    const prompt = buildImagePrompt({
      platform: item.platform,
      topic: item.title || item.description || 'Content image',
      customPrompt,
    });

    const provider = getImageProvider();
    const result = await provider.generateImage(prompt);

    // Add the image URL to the content item's resource_ids
    const updatedResourceIds = [...(item.resource_ids || [])];
    // We store the generated image URL in generated_content_url
    // Resource IDs will be managed separately via the resource upload flow
    await updateContentItem(contentItemId, {
      generated_content_url: result.url,
      resource_ids: updatedResourceIds,
    });

    return {
      success: true,
      imageUrl: result.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}