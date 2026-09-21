"use client";

import { useState } from "react";
import { getDictionary, type Language, type Service } from "@lib/i18n";
import { BookConsultationButton } from "@shared/";

type ServiceCardProps = {
  service: Service;
  index: number;
  lang: Language;
};

export default function ServiceCard({
  service,
  index,
  lang,
}: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(lang).services;
  const id = `service-details-${index}`;

  return (
    <article className={`service-card ${open ? "is-open" : ""}`}>
      <span className="service-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{service.title}</h3>
      <p>{service.teaser}</p>
      <button
        className="text-action"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? t.close : t.more}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div id={id} className="service-details">
          <p>{service.intro}</p>
          <h4>{t.includes}</h4>
          <ul>
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            <strong>{t.timing}</strong>
            {service.timing}
          </p>
          <p>
            <strong>{t.needs}</strong>
            {service.needs}
          </p>
          <BookConsultationButton lang={lang} />
        </div>
      )}
    </article>
  );
}
