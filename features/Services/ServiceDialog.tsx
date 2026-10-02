"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { homePath } from "@config/navigation";
import { getDictionary, type Language, type Service } from "@lib/i18n";

gsap.registerPlugin(useGSAP);

type ServiceDialogProps = {
  activeIndex: number | null;
  lang: Language;
  services: readonly Service[];
  trigger: HTMLButtonElement | null;
  onSelect: (index: number) => void;
  onDismiss: () => void;
};

export default function ServiceDialog({
  activeIndex,
  lang,
  services,
  trigger,
  onSelect,
  onDismiss,
}: ServiceDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeDialogRef = useRef<() => void>(() => undefined);
  const { services: t, common } = getDictionary(lang);
  const service = activeIndex === null ? null : services[activeIndex];
  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    (_context, contextSafe) => {
      closeDialogRef.current = contextSafe(() => {
        const dialog = dialogRef.current;
        const panel = panelRef.current;
        if (!dialog?.open) return;

        if (reducedMotion() || !panel) {
          dialog.close();
          return;
        }

        gsap.to(panel, {
          x: 42,
          autoAlpha: 0,
          duration: 0.28,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => dialog.close(),
        });
      });

      return () => {
        closeDialogRef.current = () => undefined;
      };
    },
    { scope: dialogRef },
  );

  function closeDialog() {
    closeDialogRef.current();
  }

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (activeIndex === null || !dialog || !panel) return;

      if (!dialog.open) {
        dialog.showModal();
        if (!reducedMotion()) {
          gsap.fromTo(
            panel,
            { x: 46, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.44,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }
      }
    },
    { scope: dialogRef, dependencies: [activeIndex] },
  );

  useGSAP(
    () => {
      if (activeIndex === null || !contentRef.current || reducedMotion()) return;
      gsap.fromTo(
        contentRef.current,
        { x: 16, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.34,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: dialogRef,
      dependencies: [activeIndex],
      revertOnUpdate: true,
    },
  );

  if (!service || activeIndex === null) return null;

  const previousIndex =
    (activeIndex - 1 + services.length) % services.length;
  const nextIndex = (activeIndex + 1) % services.length;
  const dialogTitleId = "service-dialog-title";

  return (
    <dialog
      ref={dialogRef}
      className="service-dialog"
      aria-labelledby={dialogTitleId}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={() => {
        onDismiss();
        trigger?.focus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div ref={panelRef} className="service-dialog-panel">
        <div className="service-dialog-topline">
          <span className="service-number">
            {String(activeIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
          </span>
          <div className="service-dialog-actions">
            <button
              type="button"
              aria-label={t.previous}
              onClick={() => onSelect(previousIndex)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label={t.next}
              onClick={() => onSelect(nextIndex)}
            >
              <span aria-hidden="true">→</span>
            </button>
            <button
              className="service-dialog-close"
              type="button"
              aria-label={t.close}
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div ref={contentRef} key={service.title}>
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
      </div>
    </dialog>
  );
}
