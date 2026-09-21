import { getDictionary, type Language } from "@lib/i18n";
import { Header, Footer } from "@shared/";

type LegalPageProps = {
  lang: Language;
  type: "terms" | "privacy";
};

export default function LegalPage({ lang, type }: LegalPageProps) {
  const t = getDictionary(lang).legal;

  return (
    <>
      <Header lang={lang} route={type} />
      <main className="legal-page page-shell">
        <p className="eyebrow">Andreeva Consulting Inc.</p>
        <h1>{t[type]}</h1>
        <div className="legal-notice">
          <p>{t.pending}</p>
          <p>{t.disclaimer}</p>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
