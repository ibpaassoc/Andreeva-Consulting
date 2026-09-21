"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { getDictionary, type Language } from "@lib/i18n";

type Field = "name" | "contact" | "question";
type Status = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove?: (widgetId: string) => void;
      reset?: (widgetId: string) => void;
    };
  }
}

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
  const challengeRef = useRef<HTMLDivElement>(null);
  const challengeWidgetId = useRef<string | null>(null);
  const [challengeToken, setChallengeToken] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!enabled || !turnstileSiteKey) return;

    const renderChallenge = () => {
      if (
        !challengeRef.current ||
        !window.turnstile ||
        challengeWidgetId.current
      ) {
        return;
      }

      challengeWidgetId.current = window.turnstile.render(
        challengeRef.current,
        {
          sitekey: turnstileSiteKey,
          callback: setChallengeToken,
          "expired-callback": () => setChallengeToken(""),
          "error-callback": () => setChallengeToken(""),
        },
      );
    };

    const scriptSelector = 'script[data-question-challenge="turnstile"]';
    let script = document.querySelector<HTMLScriptElement>(scriptSelector);
    let onLoad: (() => void) | undefined;

    if (script) {
      if (window.turnstile) renderChallenge();
      else {
        onLoad = renderChallenge;
        script.addEventListener("load", onLoad);
      }
    } else {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.dataset.questionChallenge = "turnstile";
      onLoad = renderChallenge;
      script.addEventListener("load", onLoad);
      document.head.appendChild(script);
    }

    return () => {
      if (script && onLoad) script.removeEventListener("load", onLoad);
      if (challengeWidgetId.current && window.turnstile?.remove) {
        window.turnstile.remove(challengeWidgetId.current);
      }
      challengeWidgetId.current = null;
      setChallengeToken("");
    };
  }, [enabled, turnstileSiteKey]);

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
    if (turnstileSiteKey && !challengeToken) {
      setError(t.challengeRequired);
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
          challengeToken,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) throw new Error("Delivery failed");
      setStatus("sent");
      form.reset();
    } catch {
      if (challengeWidgetId.current && window.turnstile?.reset) {
        window.turnstile.reset(challengeWidgetId.current);
        setChallengeToken("");
      }
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
          {turnstileSiteKey && <div ref={challengeRef} />}
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
