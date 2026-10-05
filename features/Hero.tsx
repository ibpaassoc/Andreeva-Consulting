"use client";

import { useRef } from "react";
import type { Language } from "@lib/i18n";
import { getDictionary } from "@lib/i18n";
import HeroBackground from "./Hero/HeroBackground";
import { useHeroMotion } from "./Hero/HeroMotion";
import { BookConsultationButton } from "@shared/";

export default function Hero({ lang }: { lang: Language }) {
  const t = getDictionary(lang);
  const sectionRef = useRef<HTMLElement>(null);

  useHeroMotion(sectionRef);

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <HeroBackground lang={lang} />
      <div className="hero-copy">
        <div className="hero-copy-inner">
          <p className="eyebrow" data-hero-eyebrow>
            {t.hero.eyebrow}
          </p>
          <h1 id="hero-title" aria-label={t.hero.title}>
            {t.hero.titleLines.map((line, index) => (
              <span className="hero-title-line" key={line}>
                <span
                  className={
                    index === t.hero.titleLines.length - 1
                      ? "hero-title-text hero-title-accent"
                      : "hero-title-text"
                  }
                  aria-hidden="true"
                >
                  {line}
                  {index === t.hero.titleLines.length - 1 && (
                    <span className="hero-title-underline" />
                  )}
                </span>
              </span>
            ))}
          </h1>
          <div className="hero-secondary">
            <p className="hero-description">{t.hero.description}</p>
            <ul className="hero-facts">
              {t.hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <div className="hero-primary-action">
            <BookConsultationButton lang={lang} />
          </div>
          <p className="hero-note">{t.hero.buttonDescription}</p>
        </div>
      </div>
    </section>
  );
}
