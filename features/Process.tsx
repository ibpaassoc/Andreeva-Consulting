import { getDictionary, type Language } from "@lib/i18n";

export default function Process({ lang }: { lang: Language }) {
  const t = getDictionary(lang).process;

  return (
    <section id="process" className="section process-section">
      <div className="page-shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <div className="steps">
          {t.steps.map(([title, description], index) => (
            <div className="step" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p className="section-note">{t.note}</p>
      </div>
    </section>
  );
}
