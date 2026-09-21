import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 8192;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return (realIp || forwardedFor || "unknown").slice(0, 128);
}

function checkRateLimit(request: Request) {
  const now = Date.now();
  const key = getClientKey(request);
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
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
  const rateLimit = checkRateLimit(request);
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
  if (!(await verifyChallenge(challengeToken, getClientKey(request)))) return NextResponse.json({ error: "Challenge failed" }, { status: 403 });
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
