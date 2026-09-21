import Image from "next/image";
import { getDictionary, type Language } from "@lib/i18n";
import { BookConsultationButton } from "@shared/";

export default function About({ lang }: { lang: Language }) {
  const { about, common } = getDictionary(lang);

  return (
    <section id="about" className="section about-section">
      <div className="page-shell about-layout">
        <div className="about-image">
          <Image
            src="/images/hero.png"
            fill
            sizes="(max-width: 760px) 100vw, 42vw"
            alt={common.founderImage}
          />
        </div>
        <div className="about-copy">
          <p className="eyebrow">Andreeva Consulting Inc.</p>
          <h2>{about.title}</h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about-facts">
            <div>
              <strong>6</strong>
              <span>{about.support}</span>
            </div>
            <div>
              <strong>50</strong>
              <span>{about.states}</span>
            </div>
          </div>
          <BookConsultationButton lang={lang} />
        </div>
      </div>
    </section>
  );
}
