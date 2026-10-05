"use client";

import { useRef } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionEase,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";

export default function ExamStates({ lang }: { lang: Language }) {
  const t = getDictionary(lang).exam;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        revealSectionLabel(".exam-heading .eyebrow", {
          trigger: sectionRef.current,
          scope: sectionRef.current,
          start: "top 82%",
        });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            ".exam-heading h2",
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.68,
              ease: motionEase.editorial,
              clearProps: "transform,opacity,visibility",
            },
            0.1,
          )
          .fromTo(
            ".exam-copy",
            { clipPath: "inset(0 0 100% 0)", x: 36 },
            {
              clipPath: "inset(0 0 0% 0)",
              x: 0,
              duration: 0.86,
              ease: motionEase.editorialInOut,
              clearProps: "transform,clipPath",
            },
            0.08,
          )
          .fromTo(
            ".exam-copy > *",
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.07,
              ease: motionEase.gentle,
              clearProps: "transform,opacity,visibility",
            },
            0.42,
          );
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="section exam-section">
      <div className="page-shell split-section">
        <div className="exam-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <div className="exam-copy">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <small>{t.note}</small>
        </div>
      </div>
    </section>
  );
}
