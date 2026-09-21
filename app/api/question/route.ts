import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 8192;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_SCRIPT = `
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local count = tonumber(redis.call("GET", KEYS[1]) or "0")
local ttl = redis.call("TTL", KEYS[1])
local allowed = 0

if count < limit then
  count = redis.call("INCR", KEYS[1])
  allowed = 1
end

if ttl < 0 then
  redis.call("EXPIRE", KEYS[1], window)
  ttl = window
end

return { count, ttl, allowed }
`;

function getClientKey(request: Request) {
  if (process.env.VERCEL !== "1") return null;
  // Vercel overwrites this header with the public client IP before invoking the route.
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return clientIp && clientIp.length <= 128 ? clientIp : null;
}

async function hashClientKey(clientKey: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(clientKey),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function checkRateLimit(clientKey: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { available: false, allowed: false, retryAfter: 0 };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        RATE_LIMIT_SCRIPT,
        "1",
        `question-rate:${await hashClientKey(clientKey)}`,
        String(RATE_LIMIT_MAX_REQUESTS),
        String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
      ]),
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return { available: false, allowed: false, retryAfter: 0 };

    const result = (await response.json()) as {
      error?: string;
      result?: unknown;
    };
    if (
      result.error ||
      !Array.isArray(result.result) ||
      result.result.length < 3
    ) {
      return { available: false, allowed: false, retryAfter: 0 };
    }

    const count = Number(result.result[0]);
    const ttl = Number(result.result[1]);
    const allowed = Number(result.result[2]) === 1;
    if (!Number.isFinite(count) || !Number.isFinite(ttl)) {
      return { available: false, allowed: false, retryAfter: 0 };
    }

    return {
      available: true,
      allowed,
      retryAfter: Math.max(1, Math.ceil(ttl)),
    };
  } catch {
    return { available: false, allowed: false, retryAfter: 0 };
  }
}

async function verifyChallenge(token: string, remoteIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

async function readRequestBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      try {
        await reader.cancel();
      } catch {
        // The request is already being rejected, so cancellation failure is non-fatal.
      }
      return null;
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (!clientKey) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
  const rateLimit = await checkRateLimit(clientKey);
  if (!rateLimit.available) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
    response.headers.set("Retry-After", String(rateLimit.retryAfter));
    return response;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUESTION_TO_EMAIL;
  const from = process.env.QUESTION_FROM_EMAIL;
  if (!apiKey || !to || !from || process.env.PRIVACY_COPY_APPROVED !== "true") return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  let payload: unknown;
  try {
    const body = await readRequestBody(request);
    if (body === null) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const data = payload as Record<string, unknown>;
  if (data.website) return NextResponse.json({ ok: true });
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const contact = typeof data.contact === "string" ? data.contact.trim() : "";
  const question = typeof data.question === "string" ? data.question.trim() : "";
  if (!name || !contact || !question || name.length > 100 || contact.length > 150 || question.length > 3000) return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  const challengeToken = typeof data.challengeToken === "string" ? data.challengeToken : "";
  if (!(await verifyChallenge(challengeToken, clientKey))) return NextResponse.json({ error: "Challenge failed" }, { status: 403 });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: "Andreeva Consulting — website question", text: `Name: ${name}\nContact: ${contact}\n\nQuestion:\n${question}` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Delivery failed" }, { status: 502 }); }
}
