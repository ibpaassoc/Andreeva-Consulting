"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";
import { useBottomSheetDrag } from "@shared/useBottomSheetDrag";
import { consultations, type ConsultationKey } from "./consultations";

gsap.registerPlugin(useGSAP);

type FlowState =
  | { step: "picker"; selectedKey: null }
  | { step: "calendar"; selectedKey: ConsultationKey };

type ConsultationFlowValue = {
  openPicker: () => void;
  openCalendar: (key: ConsultationKey) => void;
};

const ConsultationFlowContext = createContext<ConsultationFlowValue | null>(
  null,
);

export function useConsultationFlow() {
  const value = useContext(ConsultationFlowContext);
  if (!value) {
    throw new Error(
      "useConsultationFlow must be used inside ConsultationFlowProvider",
    );
  }
  return value;
}

export function ConsultationFlowProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Language;
}) {
  const [flow, setFlow] = useState<FlowState | null>(null);

  return (
    <ConsultationFlowContext.Provider
      value={{
        openPicker: () => setFlow({ step: "picker", selectedKey: null }),
        openCalendar: (selectedKey) =>
          setFlow({ step: "calendar", selectedKey }),
      }}
    >
      {children}
      <ConsultationFlowDialog
        flow={flow}
        lang={lang}
        onChange={setFlow}
        onDismiss={() => setFlow(null)}
      />
    </ConsultationFlowContext.Provider>
  );
}

function ConsultationFlowDialog({
  flow,
  lang,
  onChange,
  onDismiss,
}: {
  flow: FlowState | null;
  lang: Language;
  onChange: (flow: FlowState) => void;
  onDismiss: () => void;
}) {
  const t = getDictionary(lang).booking;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selected = consultations.find(({ key }) => key === flow?.selectedKey);
  const selectedIndex = consultations.findIndex(
    ({ key }) => key === flow?.selectedKey,
  );

  const finishClose = () => dialogRef.current?.close();
  const dragHandlers = useBottomSheetDrag(panelRef, finishClose);

  const { contextSafe } = useGSAP({ scope: dialogRef });
  const animateClose = contextSafe(
    (dialog: HTMLDialogElement, panel: HTMLDivElement) => {
      if (!dialog.open) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        dialog.close();
        return;
      }

      const mobile = window.matchMedia("(max-width: 760px)").matches;
      gsap.to(panel, {
        xPercent: mobile ? 0 : 102,
        yPercent: mobile ? 102 : 0,
        autoAlpha: 0,
        duration: 0.34,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => dialog.close(),
      });
    },
  );

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;

    void getCalApi({ namespace: selected.namespace })
      .then((cal) => {
        if (cancelled) return;
        cal("ui", {
          theme: "light",
          layout: "month_view",
          hideEventTypeDetails: false,
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#765b37",
              "cal-brand-emphasis": "#5e472b",
              "cal-brand-text": "#ffffff",
            },
            dark: {
              "cal-brand": "#765b37",
              "cal-brand-emphasis": "#5e472b",
              "cal-brand-text": "#ffffff",
            },
          },
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [selected]);

  function closeDialog() {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (dialog && panel) animateClose(dialog, panel);
  }

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (!flow || !dialog || !panel) return;

      if (!dialog.open) {
        dialog.showModal();
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const mobile = window.matchMedia("(max-width: 760px)").matches;

        if (!reduceMotion) {
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
          });
          timeline
            .fromTo(
              ".consultation-flow-scrim",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.28 },
              0,
            )
            .fromTo(
              panel,
              {
                xPercent: mobile ? 0 : 102,
                yPercent: mobile ? 102 : 0,
              },
              {
                xPercent: 0,
                yPercent: 0,
                duration: 0.52,
                clearProps: "transform",
              },
              0.04,
            );
        }

        const focusTimer = window.setTimeout(
          () => headingRef.current?.focus(),
          reduceMotion ? 0 : 220,
        );
        return () => {
          window.clearTimeout(focusTimer);
        };
      }
    },
    {
      scope: dialogRef,
      dependencies: [flow],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!flow || !contentRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        contentRef.current,
        { x: flow.step === "calendar" ? 20 : -20, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.38,
          ease: "power2.out",
          clearProps: "all",
        },
      );
      const focusTimer = window.setTimeout(
        () => headingRef.current?.focus(),
        120,
      );
      return () => window.clearTimeout(focusTimer);
    },
    {
      scope: dialogRef,
      dependencies: [flow?.step, flow?.selectedKey],
      revertOnUpdate: true,
    },
  );

  if (!flow) return null;

  return (
    <dialog
      ref={dialogRef}
      className="consultation-flow-dialog"
      aria-labelledby="consultation-flow-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <button
        type="button"
        className="consultation-flow-scrim"
        aria-hidden="true"
        tabIndex={-1}
        onClick={closeDialog}
      />
      <div ref={panelRef} className="consultation-flow-panel">
        <div
          className="bottom-sheet-handle"
          aria-label={t.dragToClose}
          {...dragHandlers}
        >
          <span />
        </div>
        <div className="consultation-flow-topline">
          {flow.step === "calendar" ? (
            <button
              type="button"
              className="consultation-flow-back"
              onClick={() =>
                onChange({ step: "picker", selectedKey: null })
              }
            >
              <span aria-hidden="true">←</span> {t.backToOptions}
            </button>
          ) : (
            <span className="eyebrow">{t.eyebrow}</span>
          )}
          <span className="consultation-flow-step">
            {flow.step === "picker" ? "01 / 02" : "02 / 02"}
          </span>
          <button
            type="button"
            className="consultation-flow-close"
            aria-label={t.close}
            onClick={closeDialog}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          ref={contentRef}
          className="consultation-flow-content"
          key={`${flow.step}-${flow.selectedKey ?? "none"}`}
        >
          {flow.step === "picker" ? (
            <>
              <p className="eyebrow">{t.pickerEyebrow}</p>
              <h2
                id="consultation-flow-title"
                ref={headingRef}
                tabIndex={-1}
              >
                {t.title}
              </h2>
              <p className="consultation-flow-lead">{t.pickerLead}</p>
              <div className="consultation-picker-options">
                {consultations.map((consultation, index) => {
                  const item = t.items[index];
                  return (
                    <button
                      key={consultation.key}
                      type="button"
                      className="consultation-picker-option"
                      onClick={() =>
                        onChange({
                          step: "calendar",
                          selectedKey: consultation.key,
                        })
                      }
                    >
                      <span
                        className={`consultation-picker-art consultation-picker-art-${consultation.key}`}
                        aria-hidden="true"
                      >
                        {consultation.key === "license" ? (
                          <>
                            <span className="picker-license-tools" />
                            <span className="picker-license-vessel" />
                            <span className="picker-license-mirror" />
                          </>
                        ) : (
                          <>
                            <span className="picker-passport-monogram">AC</span>
                            <span className="picker-passport-label">Passport</span>
                            <span className="picker-passport-paper" />
                          </>
                        )}
                      </span>
                      <span className="consultation-picker-copy">
                        <span className="consultation-picker-meta">
                          <span>{item.topic}</span>
                          <span>{item.price}</span>
                        </span>
                        <strong>{item.title}</strong>
                        <span className="consultation-picker-duration">
                          {item.format} · {item.duration}
                        </span>
                      </span>
                      <span className="consultation-picker-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            selected &&
            selectedIndex >= 0 && (
              <>
                <p className="eyebrow">{t.calendarEyebrow}</p>
                <h2
                  id="consultation-flow-title"
                  ref={headingRef}
                  tabIndex={-1}
                >
                  {t.calendarTitle.replace(
                    "{consultation}",
                    t.items[selectedIndex].shortTitle,
                  )}
                </h2>
                <div className="consultation-flow-calendar-meta">
                  <span>{t.items[selectedIndex].duration}</span>
                  <span>{t.items[selectedIndex].format}</span>
                  <span>{t.items[selectedIndex].price}</span>
                </div>
                <p className="consultation-flow-lead">{t.calendarLead}</p>
                <div className="consultation-flow-calendar-shell">
                  <Cal
                    key={selected.key}
                    namespace={selected.namespace}
                    calLink={selected.calLink}
                    className="consultation-flow-calendar"
                    config={{
                      layout: "month_view",
                      theme: "light",
                      "ui.color-scheme": "light",
                    }}
                  />
                </div>
                <a
                  href={`https://cal.com/${selected.calLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cal-external-link"
                >
                  {t.openCalendar} <span aria-hidden="true">↗</span>
                </a>
              </>
            )
          )}
        </div>
      </div>
    </dialog>
  );
}
