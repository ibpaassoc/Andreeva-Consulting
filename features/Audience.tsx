"use client";

import { useRef } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  revealOnScroll,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";

export default function Audience({ lang }: { lang: Language }) {
  const t = getDictionary(lang).audience;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        revealSectionLabel(".audience-caption .eyebrow", {
          trigger: sectionRef.current,
          scope: sectionRef.current,
          start: "top 80%",
        });
        revealOnScroll(".audience-caption h2", {
          trigger: sectionRef.current,
          scope: sectionRef.current,
          x: -34,
          y: 0,
          start: "top 80%",
        });
        const items = gsap.utils.toArray<HTMLElement>(
          ".audience-list li",
          sectionRef.current,
        );
        items.forEach((item, index) =>
          revealOnScroll(item, {
            trigger: item,
            scope: sectionRef.current,
            x: index % 2 === 0 ? 42 : -24,
            y: 0,
            start: "top 88%",
            fade: false,
            clearProps: "transform",
          }),
        );
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="section audience-section">
      <div className="page-shell split-section">
        <div className="sticky-caption audience-caption">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <ul className="audience-list">
          {t.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
