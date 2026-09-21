"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { homePath } from "@config/navigation";
import { getDictionary, type Language, type Service } from "@lib/i18n";

gsap.registerPlugin(useGSAP);

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { services: t, common } = getDictionary(lang);
  const titleId = `service-title-${index}`;
  const dialogTitleId = `service-dialog-title-${index}`;

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      if (!open || !dialog) return;

      dialog.showModal();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".service-dialog-panel", {
        x: 36,
        autoAlpha: 0,
        duration: 0.42,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: dialogRef, dependencies: [open], revertOnUpdate: true },
  );

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleClose() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <article className="service-card">
      <span className="service-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 id={titleId}>{service.title}</h3>
      <p>{service.teaser}</p>
      <button
        ref={triggerRef}
        className="text-action"
        type="button"
        aria-haspopup="dialog"
        aria-labelledby={`${titleId} service-more-${index}`}
        onClick={() => setOpen(true)}
      >
        <span id={`service-more-${index}`}>{t.more}</span>
        <span aria-hidden="true">+</span>
      </button>

      <dialog
        ref={dialogRef}
        className="service-dialog"
        aria-labelledby={dialogTitleId}
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="service-dialog-panel">
          <div className="service-dialog-topline">
            <span className="service-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <button
              className="service-dialog-close"
              type="button"
              aria-label={t.close}
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <h2 id={dialogTitleId}>{service.title}</h2>
          <p className="service-dialog-intro">{service.intro}</p>
          <h3>{t.includes}</h3>
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
          <a
            className="button button-primary"
            href={`${homePath(lang)}#booking`}
            onClick={closeDialog}
          >
            {common.bookConsultation}
          </a>
        </div>
      </dialog>
    </article>
  );
}
