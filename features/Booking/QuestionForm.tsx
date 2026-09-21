"use client";
import { useRef, useState, type FormEvent } from "react";
import type { Language } from "@lib/i18n";

export default function QuestionForm({ lang, enabled }: { lang: Language; enabled: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<"name" | "contact" | "question" | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const ru = lang === "ru";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const question = String(data.get("question") ?? "").trim();
    if (!name || !contact || !question) {
      setInvalid(!name ? "name" : !contact ? "contact" : "question");
      setError(ru ? "Заполните имя, способ связи и вопрос." : "Enter your name, contact details, and question.");
      (!name ? nameRef : !contact ? contactRef : questionRef).current?.focus(); return;
    }
    setError(""); setInvalid(null); setStatus("sending");
    try {
      const response = await fetch("/api/question", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, contact, question, website: data.get("website") }), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Delivery failed");
      setStatus("sent"); form.reset();
    } catch { setStatus("error"); setError(ru ? "Сообщение не отправлено. Попробуйте ещё раз позже." : "Message not sent. Please try again later."); }
  }
  return <div className="question-panel"><p className="eyebrow">{ru ? "Есть вопрос?" : "Have a question?"}</p><h3>{ru ? "Напишите нам" : "Send us a note"}</h3>
    {enabled ? <form onSubmit={submit} noValidate>
      <label>{ru ? "Имя" : "Name"}<input ref={nameRef} name="name" autoComplete="name" maxLength={100} aria-invalid={invalid === "name"} aria-describedby={invalid === "name" ? "question-error" : undefined} /></label>
      <label>{ru ? "E-mail или телефон" : "Email or phone"}<input ref={contactRef} name="contact" autoComplete="email" maxLength={150} aria-invalid={invalid === "contact"} aria-describedby={invalid === "contact" ? "question-error" : undefined} /></label>
      <label>{ru ? "Ваш вопрос" : "Your question"}<textarea ref={questionRef} name="question" rows={5} maxLength={3000} aria-invalid={invalid === "question"} aria-describedby={invalid === "question" ? "question-error" : undefined} /></label>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p id="question-error" role="alert" className="form-status">{error || (status === "sent" ? (ru ? "Сообщение отправлено." : "Message sent.") : "\u00a0")}</p>
      <button type="submit" className="button button-primary" disabled={status === "sending"}>{status === "sending" ? (ru ? "Отправляем…" : "Sending…") : (ru ? "Отправить вопрос" : "Send question")}</button>
    </form> : <p className="configuration-note">{ru ? "Форма вопросов станет доступна после подключения рабочей почты и утверждения политики конфиденциальности." : "The question form will be available once the work email is connected and the privacy policy is approved."}</p>}
  </div>;
}
