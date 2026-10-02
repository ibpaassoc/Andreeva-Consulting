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
  const extraQuestionsRef = useRef<HTMLDivElement>(null);
  const collapseTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const extraQuestions = extraQuestionsRef.current;
      if (!expanded || !extraQuestions) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
        });
        timeline
          .fromTo(
            extraQuestions,
            { height: 0, autoAlpha: 0 },
            {
              height: "auto",
              autoAlpha: 1,
              duration: 0.44,
              clearProps: "height,opacity,visibility",
            },
          )
          .fromTo(
            ".faq-item-extra",
            { y: 13, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.32,
              stagger: 0.045,
              clearProps: "all",
            },
            "-=0.24",
          );
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [expanded], revertOnUpdate: true },
  );

  useGSAP(
    () => () => collapseTweenRef.current?.kill(),
    { scope: sectionRef },
  );

  function toggleQuestions() {
    if (!expanded) {
      setExpanded(true);
      return;
    }

    const extraQuestions = extraQuestionsRef.current;
    if (
      !extraQuestions ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setExpanded(false);
      return;
    }

    collapseTweenRef.current = gsap.to(extraQuestions, {
      height: 0,
      autoAlpha: 0,
      duration: 0.36,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => setExpanded(false),
    });
  }

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
            {t.questions
              .slice(0, previewCount)
              .map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            <div
              ref={extraQuestionsRef}
              className="faq-extra-list"
              hidden={!expanded}
            >
              {t.questions
                .slice(previewCount)
                .map(([question, answer]) => (
                  <details key={question} className="faq-item-extra">
                    <summary>
                      {question}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
            </div>
          </div>
          <button
            type="button"
            className="faq-toggle"
            aria-expanded={expanded}
            onClick={toggleQuestions}
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
