"use client";

import type { MouseEvent } from "react";
import { getDictionary, type Language, type Service } from "@lib/i18n";

type ServiceCardProps = {
  service: Service;
  index: number;
  lang: Language;
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
};

export default function ServiceCard({
  service,
  index,
  lang,
  onOpen,
}: ServiceCardProps) {
  const { services: t } = getDictionary(lang);
  const titleId = `service-title-${index}`;

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    onOpen(index, event.currentTarget);
  }

  return (
    <article className="service-card">
      <span className="service-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 id={titleId}>{service.title}</h3>
      <p>{service.teaser}</p>
      <span className="text-action" aria-hidden="true">
        <span>{t.more}</span>
        <span aria-hidden="true">→</span>
      </span>
      <button
        className="service-card-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-label={`${service.title}. ${t.more}`}
        onClick={handleOpen}
      />
    </article>
  );
}
