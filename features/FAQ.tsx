"use client";

import { useRef, useState, type MouseEvent } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionEase,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";

const previewCount = 4;

function FAQItem({
  question,
  answer,
  className,
}: {
  question: string;
  answer: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (!open || !answerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(answerRef.current, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        answerRef.current,
        { height: 0, autoAlpha: 0 },
        {
          height: "auto",
          autoAlpha: 1,
          duration: 0.42,
          ease: motionEase.editorialInOut,
          clearProps: "height,opacity,visibility",
        },
      );
      gsap.fromTo(
        answerRef.current.querySelector("p"),
        { y: -7, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.34,
          ease: motionEase.gentle,
          clearProps: "transform,opacity,visibility",
        },
      );
    },
    { scope: detailsRef, dependencies: [open], revertOnUpdate: true },
  );

  useGSAP(
    () => () => closeTweenRef.current?.kill(),
    { scope: detailsRef },
  );

  function toggleItem(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    closeTweenRef.current?.kill();

    if (!open) {
      setOpen(true);
      return;
    }

    const answerElement = answerRef.current;
    if (
      !answerElement ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOpen(false);
      return;
    }

    closeTweenRef.current = gsap.to(answerElement, {
      height: 0,
      autoAlpha: 0,
      duration: 0.32,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => setOpen(false),
    });
  }

  return (
    <details ref={detailsRef} className={className} open={open}>
      <summary aria-expanded={open} onClick={toggleItem}>
        {question}
        <span className="faq-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </summary>
      <div ref={answerRef} className="faq-answer">
        <p>{answer}</p>
      </div>
    </details>
  );
}

export default function FAQ({ lang }: { lang: Language }) {
  const t = getDictionary(lang).faq;
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const extraQuestionsRef = useRef<HTMLDivElement>(null);
  const collapseTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        revealSectionLabel(".sticky-caption .eyebrow", {
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
            ".sticky-caption h2",
            { x: -24, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.58,
              ease: motionEase.editorial,
              clearProps: "transform,opacity,visibility",
            },
            0.08,
          )
          .fromTo(
            ".faq-list, .faq-toggle",
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.78,
              stagger: 0.08,
              ease: motionEase.editorialInOut,
              clearProps: "clipPath",
            },
            0.14,
          );
      });
      return () => media.revert();
    },
    { scope: sectionRef },
  );

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
        <div className="sticky-caption">
          <p className="eyebrow">FAQ</p>
          <h2>{t.title}</h2>
        </div>
        <div>
          <div className="faq-list">
            {t.questions
              .slice(0, previewCount)
              .map(([question, answer]) => (
                <FAQItem
                  key={question}
                  question={question}
                  answer={answer}
                />
              ))}
            <div
              ref={extraQuestionsRef}
              className="faq-extra-list"
              hidden={!expanded}
            >
              {t.questions
                .slice(previewCount)
                .map(([question, answer]) => (
                  <FAQItem
                    key={question}
                    question={question}
                    answer={answer}
                    className="faq-item-extra"
                  />
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
