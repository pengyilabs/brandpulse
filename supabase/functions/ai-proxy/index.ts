// Follow this setup guide to configure the Supabase CLI:
// https://supabase.com/docs/guides/cli/getting-started

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_IMAGE_URL =
  "https://openrouter.ai/api/v1/images/generations";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://brandpulsecn.netlify.app",
];

interface ProxyRequest {
  model: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  type: "chat" | "image";
  n?: number;
  size?: string;
  max_tokens?: number;
  temperature?: number;
}

function corsHeaders(origin: string): Record<string, string> {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // Validate API key is configured
  if (!OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenRouter API key not configured" }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: ProxyRequest = await req.json();

    if (!body.model || !body.type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: model, type" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    let response: Response;

    if (body.type === "chat") {
      response = await fetch(OPENROUTER_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://brandpulsecn.netlify.app",
          "X-Title": "BrandPulse",
        },
        body: JSON.stringify({
          model: body.model,
          messages: body.messages ?? [],
          max_tokens: body.max_tokens ?? 4096,
          temperature: body.temperature ?? 0.7,
        }),
      });
    } else if (body.type === "image") {
      response = await fetch(OPENROUTER_IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://brandpulsecn.netlify.app",
          "X-Title": "BrandPulse",
        },
        body: JSON.stringify({
          model: body.model,
          prompt: body.prompt ?? "",
          n: body.n ?? 1,
          size: body.size ?? "1024x1024",
        }),
      });
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported type: ${body.type}` }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({ error: `OpenRouter API error: ${response.statusText}`, details: errorText }),
        { status: response.status, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
});