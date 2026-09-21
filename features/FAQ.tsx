import { getDictionary, type Language } from "@lib/i18n";

export default function FAQ({ lang }: { lang: Language }) {
  const t = getDictionary(lang).faq;

  return (
    <section id="faq" className="section faq-section">
      <div className="page-shell split-section">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>{t.title}</h2>
        </div>
        <div className="faq-list">
          {t.questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
