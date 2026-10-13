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
import { getDictionary, type Language } from "@lib/i18n";
import { gsap, motionEase, useGSAP } from "@lib/motion";
import { useBottomSheetDrag } from "@shared/useBottomSheetDrag";
import { consultations, type ConsultationKey } from "./consultations";

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
  const headingRef = useRef<HTMLElement>(null);
  const desktopCalendarHeadingRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const stepDirectionRef = useRef(1);
  const stepTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isDesktopCalendar, setIsDesktopCalendar] = useState(false);
  const selected = consultations.find(({ key }) => key === flow?.selectedKey);
  const selectedIndex = consultations.findIndex(
    ({ key }) => key === flow?.selectedKey,
  );

  const finishClose = () => dialogRef.current?.close();
  const dragHandlers = useBottomSheetDrag(panelRef, finishClose);

  useEffect(() => {
    const viewport = window.matchMedia("(min-width: 761px)");
    const updateViewport = () => setIsDesktopCalendar(viewport.matches);

    updateViewport();
    viewport.addEventListener("change", updateViewport);
    return () => viewport.removeEventListener("change", updateViewport);
  }, []);

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
      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => dialog.close(),
      });
      timeline
        .to(
          panel,
          {
            x: mobile ? 0 : 34,
            yPercent: mobile ? 102 : 0,
            clipPath: mobile
              ? "inset(18% 0 0 0 round 20px 20px 0 0)"
              : "inset(0 0 0 16%)",
            autoAlpha: 0,
            duration: 0.36,
            ease: "power3.in",
          },
          0,
        );
    },
  );

  function transitionStep(nextFlow: FlowState, direction: number) {
    const content = contentRef.current;
    stepDirectionRef.current = direction;
    stepTweenRef.current?.kill();

    if (
      !content ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onChange(nextFlow);
      return;
    }

    stepTweenRef.current = gsap.to(content, {
      x: -24 * direction,
      autoAlpha: 0,
      duration: 0.22,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => onChange(nextFlow),
    });
  }

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;

    void getCalApi({ namespace: selected.namespace })
      .then((cal) => {
        if (cancelled) return;
        cal("ui", {
          theme: "light",
          layout: "month_view",
          hideEventTypeDetails: isDesktopCalendar,
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
  }, [selected, isDesktopCalendar]);

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

        if (reduceMotion) {
          gsap.set(panel, { clearProps: "all" });
        } else {
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
                x: mobile ? 0 : 42,
                yPercent: mobile ? 102 : 0,
                clipPath: mobile
                  ? "inset(18% 0 0 0 round 20px 20px 0 0)"
                  : "inset(0 0 0 18%)",
              },
              {
                x: 0,
                yPercent: 0,
                clipPath: mobile
                  ? "inset(0% 0 0 0 round 20px 20px 0 0)"
                  : "inset(0 0 0 0%)",
                duration: 0.52,
                clearProps: "transform,clipPath",
              },
              0.04,
            );
        }

        const focusTimer = window.setTimeout(() => {
          if (flow.step === "calendar" && isDesktopCalendar) {
            desktopCalendarHeadingRef.current?.focus();
            return;
          }
          headingRef.current?.focus();
        }, reduceMotion ? 0 : 220);
        return () => {
          window.clearTimeout(focusTimer);
        };
      }
    },
    {
      scope: dialogRef,
      dependencies: [Boolean(flow), isDesktopCalendar],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!flow || !contentRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        contentRef.current,
        { x: 24 * stepDirectionRef.current, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.38,
          ease: "power2.out",
          clearProps: "all",
        },
      );
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: flow.step === "picker" ? 0.5 : 1,
          duration: 0.48,
          ease: motionEase.editorialInOut,
          transformOrigin: "0% 50%",
          overwrite: "auto",
        });
      }
      const focusTimer = window.setTimeout(() => {
        if (flow.step === "calendar" && isDesktopCalendar) {
          desktopCalendarHeadingRef.current?.focus();
          return;
        }
        headingRef.current?.focus();
      }, 120);
      return () => window.clearTimeout(focusTimer);
    },
    {
      scope: dialogRef,
      dependencies: [flow?.step, flow?.selectedKey, isDesktopCalendar],
      revertOnUpdate: true,
    },
  );

  if (!flow) return null;

  return (
    <dialog
      ref={dialogRef}
      className="consultation-flow-dialog"
      aria-labelledby={
        flow.step === "picker" ? "consultation-flow-title" : undefined
      }
      aria-label={
        flow.step === "calendar" && selectedIndex >= 0
          ? t.calendarTitle.replace(
              "{consultation}",
              t.items[selectedIndex].shortTitle,
            )
          : undefined
      }
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={() => {
        stepTweenRef.current?.kill();
        onDismiss();
      }}
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
      <div
        ref={panelRef}
        className={`consultation-flow-panel${
          flow.step === "calendar" ? " consultation-flow-panel-calendar" : ""
        }`}
      >
        <div
          className="bottom-sheet-handle"
          aria-label={t.dragToClose}
          {...dragHandlers}
        >
          <span />
        </div>
        <div className="consultation-flow-topline">
          {flow.step === "calendar" ? (
            <>
              <button
                type="button"
                className="consultation-flow-back"
                ref={(node) => {
                  headingRef.current = node;
                }}
                onClick={() =>
                  transitionStep({ step: "picker", selectedKey: null }, -1)
                }
              >
                <span aria-hidden="true">←</span> {t.backToOptions}
              </button>
              <span className="consultation-calendar-topline-label">
                {t.calendarTopline}
              </span>
            </>
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
          <span className="consultation-flow-progress" aria-hidden="true">
            <span
              ref={progressRef}
              style={{
                transform: `scaleX(${flow.step === "picker" ? 0.5 : 1})`,
              }}
            />
          </span>
        </div>

        <div
          ref={contentRef}
          className="consultation-flow-content"
          key={`${flow.step}-${flow.selectedKey ?? "none"}`}
        >
          {flow.step === "picker" ? (
            <>
              <p
                className="eyebrow"
                id="consultation-flow-title"
                ref={(node) => {
                  headingRef.current = node;
                }}
                tabIndex={-1}
              >
                {t.pickerEyebrow}
              </p>
              <div className="consultation-picker-options">
                {consultations.map((consultation, index) => {
                  const item = t.items[index];
                  return (
                    <button
                      key={consultation.key}
                      type="button"
                      className="consultation-picker-option"
                      onClick={() =>
                        transitionStep(
                          {
                            step: "calendar",
                            selectedKey: consultation.key,
                          },
                          1,
                        )
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
                <div className="consultation-calendar-intro">
                  <div>
                    <p className="eyebrow">{t.calendarEyebrow}</p>
                    <h2 ref={desktopCalendarHeadingRef} tabIndex={-1}>
                      {t.items[selectedIndex].topic}
                    </h2>
                    <p className="consultation-calendar-lead">
                      {t.calendarDesktopLead}
                    </p>
                  </div>
                </div>
                <Cal
                  key={`${selected.key}-${isDesktopCalendar ? "desktop" : "mobile"}`}
                  namespace={selected.namespace}
                  calLink={selected.calLink}
                  className="consultation-flow-calendar"
                  config={{
                    layout: "month_view",
                    hideEventTypeDetails: String(isDesktopCalendar),
                    theme: "light",
                    "ui.color-scheme": "light",
                  }}
                />
              </>
            )
          )}
        </div>
      </div>
    </dialog>
  );
}
