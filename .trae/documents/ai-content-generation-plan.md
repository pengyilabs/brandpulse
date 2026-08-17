# AI Content Generation — Implementation Plan

## Branch: `feat/ai-content-generation`
## Single PR with 6 commits (one per subtask)

---

## Architecture Overview

### Security Model

**CRITICAL: The OpenRouter API key must NEVER be exposed to the client.**

- This is a Vite SPA (no backend server). Environment variables prefixed with `VITE_` are bundled into the client-side code and visible to anyone.
- Therefore, AI API calls **cannot** be made directly from the browser.
- **Solution**: Use Supabase Edge Functions (Deno-based serverless functions) as a secure proxy.
  - The API key is stored as a server-side environment variable on the Edge Function.
  - The frontend calls the Edge Function endpoint.
  - The Edge Function forwards the request to OpenRouter and returns the result.
  - The API key is never sent to the client.

### Provider Interface Pattern

Each AI capability (text, image, video) has a provider interface. This allows swapping providers (e.g., OpenRouter → API易 → direct provider) without changing the rest of the code.

```
src/
  lib/
    ai/
      providers/
        text/
          TextGenerationProvider.ts      ← Interface
          OpenRouterTextProvider.ts       ← Implementation
        image/
          ImageGenerationProvider.ts      ← Interface
          OpenRouterImageProvider.ts      ← Implementation
        video/
          VideoGenerationProvider.ts      ← Interface
          OpenRouterVideoProvider.ts      ← Implementation
      index.ts                           ← Provider registry / factory
    services/
      ai-content-service.ts              ← Orchestrates planning → generation
  supabase/
    functions/
      ai-proxy/                          ← Edge Function: secure proxy to OpenRouter
        index.ts
```

### Data Flow

```
[Browser] → POST /api/... → [Supabase Edge Function] → POST https://openrouter.ai/api/v1/...
                                                              ↑
                                                        API key stored here (server-side env)
```

---

## Commit 1/6: AI Provider Setup — OpenRouter env vars, Edge Function, connectivity test

### Scope

1. Create Supabase Edge Function `ai-proxy` as a secure proxy to OpenRouter API
2. Set `OPENROUTER_API_KEY` as a server-side environment variable on the Edge Function
3. Configure `.env.example` with a placeholder (NOT the real key)
4. Write a connectivity test script that calls the Edge Function locally
5. Document how to set up the key locally (`.env.local` for Supabase Edge Functions)

### Security Rules

- `OPENROUTER_API_KEY` must NEVER appear in any committed file
- `.env.example` must contain only: `OPENROUTER_API_KEY=your_openrouter_api_key_here`
- No `VITE_OPENROUTER_API_KEY` anywhere (would expose to client)
- Edge Function is the only place that reads the API key

### What the user needs to provide

When running/test this locally, the user will be prompted to:
1. Copy `.env.example` to `.env.local`
2. Set their OpenRouter API key in `.env.local`
3. Run `supabase functions serve ai-proxy` locally

---

## Commit 2/6: AI Text Generation Service — DeepSeek V4 via OpenRouter

### Scope

1. Create `TextGenerationProvider` interface with method: `generateText(prompt, options) → Promise<string>`
2. Create `OpenRouterTextProvider` that implements the interface
   - Calls OpenRouter with model `deepseek/deepseek-v4-flash` (or similar)
   - Handles streaming/non-streaming responses
3. Expose via provider registry in `src/lib/ai/index.ts`
4. Write unit tests with mock provider

### OpenRouter API Reference

```
POST https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer <api-key>
  Content-Type: application/json
Body:
  {
    "model": "deepseek/deepseek-v4-flash",
    "messages": [...],
    "temperature": 0.7
  }
```

---

## Commit 3/6: AI Image Generation Service — Seedream via OpenRouter

### Scope

1. Create `ImageGenerationProvider` interface with method: `generateImage(prompt, options) → Promise<{url, width, height}>`
2. Create `OpenRouterImageProvider` that implements the interface
   - Calls OpenRouter with an image generation model (e.g., FLUX, DALL-E, or whichever OpenRouter routes to Seedream)
   - Note: OpenRouter may not support Seedream directly; may need to use FLUX or DALL-E as fallback
3. Handle image URL retrieval and storage
4. Expose via provider registry

### OpenRouter Image API

```
POST https://openrouter.ai/api/v1/images/generations
Headers:
  Authorization: Bearer <api-key>
Body:
  {
    "model": "openai/dall-e-3",
    "prompt": "...",
    "n": 1,
    "size": "1024x1024"
  }
```

---

## Commit 4/6: AI Video Generation Service — Seedance via OpenRouter

### Scope

1. Create `VideoGenerationProvider` interface with method: `generateVideo(prompt, options) → Promise<{url, status}>`
2. Create `OpenRouterVideoProvider` that implements the interface
   - Calls OpenRouter with video generation model (e.g., Seedance 2.0/2.5)
   - Video generation is typically async (submit task → poll for result)
3. Handle polling mechanism for video completion
4. Expose via provider registry

### OpenRouter Video API

```
POST https://openrouter.ai/api/v1/video/generations
Headers:
  Authorization: Bearer <api-key>
Body:
  {
    "model": "bytedance/seedance-2.0",
    "prompt": "...",
    "duration": 5
  }
```

---

## Commit 5/6: Content Planning to Generation Pipeline

### Scope

1. Create `ai-content-service.ts` that orchestrates the full pipeline:
   - **Plan**: Given resources (brand kit, writer profile, campaign brief), generate a content plan
   - **Agree**: User reviews and approves the plan
   - **Generate**: Execute the approved plan — call text/image/video providers as needed
2. Wire into the existing campaign flow (`campaign-creation-full-view.tsx`)
3. Add status progression: `Draft → Generating → Ready-for-review → Approved`
4. Store generated content back to Supabase `content_items` table

### Pipeline Flow

```
[Campaign Plan Complete]
        ↓
[AI generates content plan] ← Commit 2 (text)
        ↓
[User reviews & approves]
        ↓
[AI generates content] ← Commit 2, 3, 4 (text + image + video)
        ↓
[Content saved to Supabase]
        ↓
[User reviews & publishes]
```

---

## Commit 6/6: Platform-Specific Content Generation — WeChat, Xiaohongshu, Douyin

### Scope

1. Create renderer modules for each platform:
   - `WeChatRenderer` — formats content for WeChat Official Account (article, moments, video)
   - `XiaohongshuRenderer` — formats content for Xiaohongshu (note, carousel, video)
   - `DouyinRenderer` — formats content for Douyin (short video, image post)
2. Each renderer:
   - Takes raw AI-generated content (text, images, video)
   - Formats it according to platform specs (character limits, image dimensions, etc.)
   - Generates the final content structure ready for posting
3. Update the content creation modal (`smart-content-creation-modal.tsx`) to support Chinese platform content types

### Platform Specs Summary

| Platform | Content Types | Text Limit | Image Specs | Video Specs |
|---|---|---|---|---|
| WeChat | Article, Moments, Video | 1500-3000 words | 900×383 px (cover) | 1080×1920 |
| Xiaohongshu | Note, Carousel, Video | 500-1000 chars | 1080×1440 (3-9 images) | 1080×1920 |
| Douyin | Short Video, Image Post | 220 chars | 1080×1920 | 1080×1920 |

---

## Deployment Notes

- Edge Functions are deployed via `supabase functions deploy ai-proxy`
- The `OPENROUTER_API_KEY` env var must be set in Supabase dashboard (not in code)
- Netlify deploy: Edge Functions are separate from the frontend build
- Frontend calls the Edge Function URL (not OpenRouter directly)

## Security Checklist

- [ ] No API key in `.env` files committed to git
- [ ] No API key in `VITE_` prefixed variables
- [ ] Edge Function is the only component that reads the API key
- [ ] `.env.example` contains only placeholder values
- [ ] `gitignore` includes `.env.local`, `.env.production`