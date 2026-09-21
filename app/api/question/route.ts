import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUESTION_TO_EMAIL;
  const from = process.env.QUESTION_FROM_EMAIL;
  if (!apiKey || !to || !from || process.env.PRIVACY_COPY_APPROVED !== "true") return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  let payload: unknown;
  try { const body = await request.text(); if (body.length > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 }); payload = JSON.parse(body); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
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
    });
    if (!response.ok) return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Delivery failed" }, { status: 502 }); }
}
