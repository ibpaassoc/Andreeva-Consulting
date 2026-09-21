import { getDictionary, type Language } from "@lib/i18n";

export default function ExamStates({ lang }: { lang: Language }) {
  const t = getDictionary(lang).exam;

  return (
    <section className="section exam-section">
      <div className="page-shell split-section">
        <div>
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
