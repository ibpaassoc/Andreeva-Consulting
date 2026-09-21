import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 8192;

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
