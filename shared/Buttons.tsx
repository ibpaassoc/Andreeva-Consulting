"use client";

import { useRef } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import { gsap, motionQueries, useGSAP } from "@lib/motion";
import { useConsultationFlow } from "@features/Booking/ConsultationFlow";

interface BookConsultationButtonProps {
  lang: Language;
}

export default function BookConsultationButton({
  lang,
}: BookConsultationButtonProps) {
  const t = getDictionary(lang);
  const { openPicker } = useConsultationFlow();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          finePointer: motionQueries.finePointer,
          reduceMotion: motionQueries.reduce,
        },
        (context) => {
          const { finePointer, reduceMotion } = context.conditions as {
            finePointer: boolean;
            reduceMotion: boolean;
          };
          const button = buttonRef.current;
          if (!button || !finePointer || reduceMotion) return;

          const xTo = gsap.quickTo(button, "x", {
            duration: 0.38,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(button, "y", {
            duration: 0.38,
            ease: "power3.out",
          });
          const onPointerMove = (event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            xTo(((event.clientX - bounds.left) / bounds.width - 0.5) * 10);
            yTo(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
          };
          const onPointerLeave = () => {
            xTo(0);
            yTo(0);
          };

          button.addEventListener("pointermove", onPointerMove);
          button.addEventListener("pointerleave", onPointerLeave);
          return () => {
            button.removeEventListener("pointermove", onPointerMove);
            button.removeEventListener("pointerleave", onPointerLeave);
          };
        },
      );

      return () => media.revert();
    },
    { scope: buttonRef },
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      className="button button-primary"
      onClick={openPicker}
    >
      {t.common.bookConsultation}
    </button>
  );
}
