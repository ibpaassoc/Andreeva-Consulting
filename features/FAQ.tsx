"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";

gsap.registerPlugin(useGSAP);

const previewCount = 4;

export default function FAQ({ lang }: { lang: Language }) {
  const t = getDictionary(lang).faq;
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!expanded) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".faq-item-extra",
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.46,
            stagger: 0.055,
            ease: "power2.out",
            clearProps: "all",
          },
        );
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [expanded], revertOnUpdate: true },
  );

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`section faq-section${expanded ? " is-expanded" : ""}`}
    >
      <div className="page-shell split-section faq-layout">
        <div className="faq-caption">
          <p className="eyebrow">FAQ</p>
          <h2>{t.title}</h2>
        </div>
        <div>
          <div className="faq-list">
            {t.questions.map(([question, answer], index) => {
              const isExtra = index >= previewCount;

              return (
                <details
                  key={question}
                  className={isExtra ? "faq-item-extra" : undefined}
                  hidden={isExtra && !expanded}
                >
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              );
            })}
          </div>
          <button
            type="button"
            className="faq-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <span>{expanded ? t.showLess : t.showMore}</span>
            <span className="faq-toggle-arrow" aria-hidden="true">
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
