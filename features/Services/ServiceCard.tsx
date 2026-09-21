"use client";
import { useState } from "react";
import type { Language } from "@lib/i18n";
import type { Service } from "./content";
import { BookConsultationButton } from "@shared/";

export default function ServiceCard({ service, index, lang }: { service: Service; index: number; lang: Language }) {
  const [open, setOpen] = useState(false);
  const id = `service-details-${index}`;
  return <article className={`service-card ${open ? "is-open" : ""}`}>
    <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
    <h3>{service.title}</h3><p>{service.teaser}</p>
    <button className="text-action" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {open ? (lang === "ru" ? "Свернуть" : "Show less") : (lang === "ru" ? "Подробнее" : "Learn more")} <span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    {open && <div id={id} className="service-details">
      <p>{service.intro}</p><h4>{lang === "ru" ? "Что входит" : "What’s included"}</h4>
      <ul>{service.includes.map(item => <li key={item}>{item}</li>)}</ul>
      <p><strong>{lang === "ru" ? "Сроки: " : "Timeline: "}</strong>{service.timing}</p>
      <p><strong>{lang === "ru" ? "От вас нужно: " : "What we need from you: "}</strong>{service.needs}</p>
      <BookConsultationButton lang={lang} />
    </div>}
  </article>;
}
