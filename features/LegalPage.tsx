import type { Language } from "@lib/i18n";
import { Header, Footer } from "@shared/";

export default function LegalPage({ lang, type }: { lang: Language; type: "terms" | "privacy" }) {
  const ru = lang === "ru";
  const title = type === "terms" ? (ru ? "Договор оферты" : "Terms of service") : (ru ? "Политика конфиденциальности" : "Privacy policy");
  return <><Header lang={lang} /><main className="legal-page page-shell"><p className="eyebrow">Andreeva Consulting Inc.</p><h1>{title}</h1>
    <div className="legal-notice"><p>{ru ? "Текст этой страницы ожидает утверждения заказчиком. Пока он не опубликован, запись и форма вопросов не должны принимать персональные данные." : "The company-approved text for this page is pending. Booking and the question form must not collect personal information until it is published."}</p>
      <p>{ru ? "Andreeva Consulting Inc. оказывает консультационные услуги и помощь в подготовке документов. Компания не является юридической фирмой и не предоставляет юридических консультаций. Решения о выдаче лицензий принимают соответствующие state boards." : "Andreeva Consulting Inc. provides consulting and document-preparation support. It is not a law firm and does not provide legal advice. Licensing decisions are made by the relevant state boards."}</p></div>
  </main><Footer lang={lang} /></>;
}
