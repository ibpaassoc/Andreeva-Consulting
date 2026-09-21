import { getDictionary, type Language } from "@lib/i18n";
import { homePath, navigation } from "@config/navigation";

export default function Footer({ lang }: { lang: Language }) {
  const t = getDictionary(lang).footer;
  const base = homePath(lang);
  const socials = [
    ["Instagram", process.env.INSTAGRAM_URL],
    ["Telegram", process.env.TELEGRAM_URL],
    ["WhatsApp", process.env.WHATSAPP_URL],
  ].filter((entry): entry is [string, string] =>
    Boolean(entry[1] && /^https:\/\//.test(entry[1])),
  );
  const email = process.env.CONTACT_EMAIL;

  return (
    <footer id="contact" className="site-footer">
      <div className="page-shell">
        <div className="footer-grid">
          <div>
            <h2>
              Andreeva
              <br />
              Consulting Inc.
            </h2>
            <p>{t.tagline}</p>
          </div>
          <div>
            <h3>{t.explore}</h3>
            {navigation(lang).map((item) => (
              <a key={item.href} href={`${base}#${item.href}`}>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <h3>{t.connect}</h3>
            {socials.map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label} ↗
              </a>
            ))}
            {email && <a href={`mailto:${email}`}>{email}</a>}
            {!email && !socials.length && <p>{t.contactsPending}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Andreeva Consulting Inc.</span>
          <div>
            <a href={`${base === "/" ? "" : base}/terms`}>{t.terms}</a>
            <a href={`${base === "/" ? "" : base}/privacy`}>{t.privacy}</a>
          </div>
        </div>
        <p className="footer-disclaimer">{t.disclaimer}</p>
      </div>
    </footer>
  );
}
