import type { Language } from "@lib/i18n";
import { homePath, navigation } from "@config/navigation";
export default function Footer({ lang }: { lang: Language }) {
  const ru = lang === "ru";
  const base = homePath(lang);
  const socials = [
    ["Instagram", process.env.INSTAGRAM_URL], ["Telegram", process.env.TELEGRAM_URL], ["WhatsApp", process.env.WHATSAPP_URL],
  ].filter((entry): entry is [string, string] => Boolean(entry[1] && /^https:\/\//.test(entry[1])));
  const email = process.env.CONTACT_EMAIL;
  return <footer id="contact" className="site-footer"><div className="page-shell"><div className="footer-grid">
    <div><h2>Andreeva<br />Consulting Inc.</h2><p>{ru ? "Помогаем бьюти-мастерам легально работать в США." : "Helping beauty professionals work legally in the U.S."}</p></div>
    <div><h3>{ru ? "Навигация" : "Explore"}</h3>{navigation(lang).map(item => <a key={item.href} href={`${base}#${item.href}`}>{item.label}</a>)}</div>
    <div><h3>{ru ? "Связаться" : "Connect"}</h3>{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}
      {email && <a href={`mailto:${email}`}>{email}</a>}{!email && !socials.length && <p>{ru ? "Контакты появятся после подтверждения заказчиком." : "Contact details will appear once confirmed by the company."}</p>}
    </div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Andreeva Consulting Inc.</span><div><a href={`${lang === "ru" ? "" : "/en"}/terms`}>{ru ? "Договор оферты" : "Terms"}</a><a href={`${lang === "ru" ? "" : "/en"}/privacy`}>{ru ? "Политика конфиденциальности" : "Privacy policy"}</a></div></div>
    <p className="footer-disclaimer">{ru ? "Andreeva Consulting Inc. оказывает консультационные услуги и помощь в подготовке документов. Компания не является юридической фирмой и не предоставляет юридических консультаций. Лицензии выдаёт state board соответствующего штата." : "Andreeva Consulting Inc. provides consulting and document-preparation support. It is not a law firm and does not provide legal advice. The relevant state board issues licenses."}</p>
  </div></footer>;
}
