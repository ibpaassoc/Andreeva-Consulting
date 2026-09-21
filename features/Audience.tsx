import { getDictionary, type Language } from "@lib/i18n";

export default function Audience({ lang }: { lang: Language }) {
  const t = getDictionary(lang).audience;

  return (
    <section className="section audience-section">
      <div className="page-shell split-section">
        <div>
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
