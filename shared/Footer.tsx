import type { Language } from "@lib/i18n";
export default function Footer({ lang }: { lang: Language }) {
  return <footer id="contact" className="site-footer"><div className="page-shell"><p>© {new Date().getFullYear()} Andreeva Consulting Inc.</p>
    <p>{lang === "ru" ? "Консультационные услуги. Не юридическая фирма; юридические консультации не предоставляются." : "Consulting services. Not a law firm; no legal advice is provided."}</p>
  </div></footer>;
}
