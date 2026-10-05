import { getDictionary, type Language } from "@lib/i18n";
import { homePath, navigation } from "@config/navigation";
import FooterMotion from "./FooterMotion";

export default function Footer({ lang }: { lang: Language }) {
  const t = getDictionary(lang).footer;
  const base = homePath(lang);
  const socials = [
    [
      "Instagram",
      process.env.INSTAGRAM_URL ||
        "https://www.instagram.com/andreeva__iuliia/",
    ],
    ["Telegram", process.env.TELEGRAM_URL],
    ["WhatsApp", process.env.WHATSAPP_URL],
  ].filter((entry): entry is [string, string] =>
    Boolean(entry[1] && /^https:\/\//.test(entry[1])),
  );
  const email = process.env.CONTACT_EMAIL || "support@andreevaconsulting.org";

  return (
    <FooterMotion>
      <div className="footer-wordmark" aria-hidden="true">
        <span className="footer-wordmark-primary">ANDREEVA</span>
        <span className="footer-wordmark-secondary">CONSULTING</span>
      </div>
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
                className={label === "Instagram" ? "footer-contact-link" : undefined}
              >
                {label === "Instagram" && (
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                )}
                {label}
              </a>
            ))}
            {email && (
              <a className="footer-contact-link" href={`mailto:${email}`}>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                {email}
              </a>
            )}
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
    </FooterMotion>
  );
}
