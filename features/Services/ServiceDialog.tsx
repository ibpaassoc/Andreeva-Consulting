"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language, type Service } from "@lib/i18n";
import { useBottomSheetDrag } from "@shared/useBottomSheetDrag";
import { useConsultationFlow } from "@features/Booking/ConsultationFlow";

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
  const { services: t, common } = getDictionary(lang);
  const { openPicker } = useConsultationFlow();
  const service = activeIndex === null ? null : services[activeIndex];
  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { contextSafe } = useGSAP({ scope: dialogRef });
  const animateClose = contextSafe(
    (dialog: HTMLDialogElement, panel: HTMLDivElement) => {
      if (!dialog.open) return;
      if (reducedMotion()) {
        dialog.close();
        return;
      }

      const mobile = window.matchMedia("(max-width: 760px)").matches;
      gsap.to(panel, {
        x: mobile ? 0 : 42,
        yPercent: mobile ? 104 : 0,
        autoAlpha: 0,
        duration: 0.28,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => dialog.close(),
      });
    },
  );

  function closeDialog() {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (dialog && panel) animateClose(dialog, panel);
  }

  function continueToConsultation() {
    closeDialog();
    window.setTimeout(openPicker, reducedMotion() ? 0 : 320);
  }

  const dragHandlers = useBottomSheetDrag(
    panelRef,
    () => dialogRef.current?.close(),
  );

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (activeIndex === null || !dialog || !panel) return;

      if (!dialog.open) {
        dialog.showModal();
        if (!reducedMotion()) {
          const mobile = window.matchMedia("(max-width: 760px)").matches;
          gsap.fromTo(
            panel,
            {
              x: mobile ? 0 : 46,
              yPercent: mobile ? 104 : 0,
              autoAlpha: 0,
            },
            {
              x: 0,
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.44,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }
      }
    },
    {
      scope: dialogRef,
      dependencies: [activeIndex],
      revertOnUpdate: true,
    },
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
      <button
        type="button"
        className="service-dialog-scrim"
        aria-hidden="true"
        tabIndex={-1}
        onClick={closeDialog}
      />
      <div ref={panelRef} className="service-dialog-panel">
        <div
          className="bottom-sheet-handle"
          aria-label={t.dragToClose}
          {...dragHandlers}
        >
          <span />
        </div>
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
          <button
            type="button"
            className="button button-primary"
            onClick={continueToConsultation}
          >
            {common.bookConsultation}
          </button>
        </div>
      </div>
    </dialog>
  );
}
