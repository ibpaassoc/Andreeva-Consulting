import type { Language } from "@lib/i18n";
import { getDictionary } from "@lib/i18n";
import HeroBackground from "./Hero/HeroBackground";
import HeroMotion from "./Hero/HeroMotion";
import { BookConsultationButton } from "@shared/";
export default function Hero({ lang }: { lang: Language }) {
  const t = getDictionary(lang);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroBackground lang={lang} />
      <div className="hero-copy">
        <HeroMotion>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-title">{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <ul className="hero-facts">
            {t.hero.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <BookConsultationButton lang={lang} />
          <p className="hero-note">{t.hero.buttonDescription}</p>
        </HeroMotion>
      </div>
    </section>
  );
}
