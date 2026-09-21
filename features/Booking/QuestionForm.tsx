"use client";

import { useRef, useState, type FormEvent } from "react";
import { getDictionary, type Language } from "@lib/i18n";

type Field = "name" | "contact" | "question";
type Status = "idle" | "sending" | "sent" | "error";

export default function QuestionForm({
  lang,
  enabled,
}: {
  lang: Language;
  enabled: boolean;
}) {
  const t = getDictionary(lang).booking;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Field | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const question = String(data.get("question") ?? "").trim();

    if (!name || !contact || !question) {
      setInvalid(!name ? "name" : !contact ? "contact" : "question");
      setError(t.missingFields);
      (!name ? nameRef : !contact ? contactRef : questionRef).current?.focus();
      return;
    }

    setError("");
    setInvalid(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          question,
          website: data.get("website"),
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) throw new Error("Delivery failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError(t.sendError);
    }
  }

  return (
    <div className="question-panel">
      <p className="eyebrow">{t.questionEyebrow}</p>
      <h3>{t.questionTitle}</h3>
      {enabled ? (
        <form onSubmit={submit} noValidate>
          <label>
            {t.name}
            <input
              ref={nameRef}
              name="name"
              autoComplete="name"
              maxLength={100}
              aria-invalid={invalid === "name"}
              aria-describedby={
                invalid === "name" ? "question-error" : undefined
              }
            />
          </label>
          <label>
            {t.contact}
            <input
              ref={contactRef}
              name="contact"
              autoComplete="email"
              maxLength={150}
              aria-invalid={invalid === "contact"}
              aria-describedby={
                invalid === "contact" ? "question-error" : undefined
              }
            />
          </label>
          <label>
            {t.question}
            <textarea
              ref={questionRef}
              name="question"
              rows={5}
              maxLength={3000}
              aria-invalid={invalid === "question"}
              aria-describedby={
                invalid === "question" ? "question-error" : undefined
              }
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              {t.website}
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <p id="question-error" role="alert" className="form-status">
            {error || (status === "sent" ? t.sent : "\u00a0")}
          </p>
          <button
            type="submit"
            className="button button-primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? t.sending : t.send}
          </button>
        </form>
      ) : (
        <p className="configuration-note">{t.formPending}</p>
      )}
    </div>
  );
}
