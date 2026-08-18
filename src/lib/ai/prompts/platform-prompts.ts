export interface PlatformPrompt {
  name: string;
  label: string;
  description: string;
  wordCountMin: number;
  wordCountMax: number;
  imageSpecs: {
    width: number;
    height: number;
    count?: { min: number; max: number };
  };
  toneGuidelines: string[];
  structureInstructions: string;
}

export const platformPrompts: Record<string, PlatformPrompt> = {
  wechat: {
    name: 'wechat',
    label: 'WeChat Official Account',
    description: '公众号文章',
    wordCountMin: 1500,
    wordCountMax: 3000,
    imageSpecs: {
      width: 900,
      height: 383,
    },
    toneGuidelines: [
      '专业且平易近人，适合微信公众号读者',
      '使用中文，语气亲切自然',
      '避免过度营销或标题党风格',
    ],
    structureInstructions: `请生成一篇微信公众号文章，包含以下结构：
1. 标题：吸引人且包含核心关键词
2. 引言：简要介绍主题，吸引读者继续阅读
3. 正文：2-4个小标题段落，每个段落300-500字
4. 结论：总结要点并加入行动号召（CTA）
5. 文章末尾添加2-3个相关话题标签`,
  },
  xiaohongshu: {
    name: 'xiaohongshu',
    label: 'Xiaohongshu',
    description: '小红书笔记',
    wordCountMin: 500,
    wordCountMax: 1000,
    imageSpecs: {
      width: 1080,
      height: 1440,
      count: { min: 3, max: 9 },
    },
    toneGuidelines: [
      '真实分享、接地气、有亲和力',
      '使用emoji增加可读性',
      '语气像朋友推荐，而非官方宣传',
    ],
    structureInstructions: `请生成一篇小红书笔记，包含以下结构：
1. 标题：简洁有力，10-20字，吸引点击
2. 正文：分段清晰，每段2-3行，使用emoji点缀
3. 标签：末尾添加5-10个相关话题标签（以#开头）
4. 整体风格轻松活泼，适合小红书用户阅读习惯`,
  },
  douyin: {
    name: 'douyin',
    label: 'Douyin',
    description: '抖音短视频',
    wordCountMin: 50,
    wordCountMax: 220,
    imageSpecs: {
      width: 1080,
      height: 1920,
    },
    toneGuidelines: [
      '简短有力，快速抓住注意力',
      '使用口语化表达',
      '适合视频配合的文字说明',
    ],
    structureInstructions: `请生成一条抖音视频文案，包含以下结构：
1. 标题/封面文案：1-2句，15字以内，吸引眼球
2. 视频描述：50-150字，说明视频内容
3. 话题标签：末尾添加3-5个相关话题标签（以#开头）
4. 整体文案需简洁精炼，适合快速阅读`,
  },
};

export function getPlatformPrompt(platform: string): PlatformPrompt | undefined {
  return platformPrompts[platform];
}

export function buildContentPrompt(params: {
  platform: string;
  topic: string;
  contentType?: string;
  tone?: string;
  wordCount?: string;
  brandKit?: { tone_of_voice?: string; description?: string };
  writerProfile?: { style?: string; tone?: string; audience?: string; topics?: string };
}): string {
  const platformSpec = getPlatformPrompt(params.platform);
  if (!platformSpec) {
    return `请为${params.platform}平台生成内容。主题：${params.topic}`;
  }

  const sections: string[] = [];
  sections.push(`请为【${platformSpec.label}】生成一篇${platformSpec.description}。`);
  sections.push(`主题：${params.topic}`);
  sections.push(`字数要求：${platformSpec.wordCountMin}-${platformSpec.wordCountMax}字`);

  if (params.contentType) {
    sections.push(`内容类型：${params.contentType}`);
  }

  if (params.tone) {
    sections.push(`语气风格：${params.tone}`);
  }

  if (params.writerProfile) {
    const wp = params.writerProfile;
    const profileParts: string[] = [];
    if (wp.style) profileParts.push(`风格：${wp.style}`);
    if (wp.tone) profileParts.push(`语气：${wp.tone}`);
    if (wp.audience) profileParts.push(`目标受众：${wp.audience}`);
    if (wp.topics) profileParts.push(`擅长话题：${wp.topics}`);
    if (profileParts.length > 0) {
      sections.push(`写手设定：${profileParts.join('；')}`);
    }
  }

  if (params.brandKit) {
    const bk = params.brandKit;
    const brandParts: string[] = [];
    if (bk.tone_of_voice) brandParts.push(`品牌语气：${bk.tone_of_voice}`);
    if (bk.description) brandParts.push(`品牌描述：${bk.description}`);
    if (brandParts.length > 0) {
      sections.push(`品牌设定：${brandParts.join('；')}`);
    }
  }

  sections.push(`语气指南：${platformSpec.toneGuidelines.join('；')}`);
  sections.push(`结构要求：${platformSpec.structureInstructions}`);

  return sections.join('\n\n');
}

export function buildImagePrompt(params: {
  platform: string;
  topic: string;
  style?: string;
  customPrompt?: string;
}): string {
  const platformSpec = getPlatformPrompt(params.platform);
  const dimensions = platformSpec
    ? `${platformSpec.imageSpecs.width}×${platformSpec.imageSpecs.height}`
    : '1024×1024';

  if (params.customPrompt) {
    return params.customPrompt;
  }

  return `请生成一张适合${platformSpec?.label || params.platform}平台的配图，尺寸为${dimensions}。主题：${params.topic}。${params.style ? `风格：${params.style}。` : ''}图片应为高质量、专业水准的视觉内容。`;
}