const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? '';
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_IMAGE_URL = 'https://openrouter.ai/api/v1/images/generations';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:8888',
  'https://brandpulsecn.netlify.app',
];

interface ProxyRequest {
  model: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  type: 'chat' | 'image';
  n?: number;
  size?: string;
  max_tokens?: number;
  temperature?: number;
}

function corsHeaders(origin: string): Record<string, string> {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export const handler = async (event: { httpMethod: string; headers: Record<string, string | undefined>; body: string | null }) => {
  const origin = event.headers.origin ?? '';
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate API key is configured
  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OpenRouter API key not configured' }),
    };
  }

  try {
    const body: ProxyRequest = JSON.parse(event.body ?? '{}');

    if (!body.model || !body.type) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields: model, type' }),
      };
    }

    let response: Response;

    if (body.type === 'chat') {
      response = await fetch(OPENROUTER_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://brandpulsecn.netlify.app',
          'X-Title': 'BrandPulse',
        },
        body: JSON.stringify({
          model: body.model,
          messages: body.messages ?? [],
          max_tokens: body.max_tokens ?? 4096,
          temperature: body.temperature ?? 0.7,
        }),
      });
    } else if (body.type === 'image') {
      response = await fetch(OPENROUTER_IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://brandpulsecn.netlify.app',
          'X-Title': 'BrandPulse',
        },
        body: JSON.stringify({
          model: body.model,
          prompt: body.prompt ?? '',
          n: body.n ?? 1,
          size: body.size ?? '1024x1024',
        }),
      });
    } else {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Unsupported type: ${body.type}` }),
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error (${response.status}):`, errorText);
      return {
        statusCode: response.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `OpenRouter API error: ${response.statusText}`, details: errorText }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};