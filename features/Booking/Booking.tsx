import { getDictionary, type Language } from "@lib/i18n";
import QuestionForm from "./QuestionForm";

export default function Booking({ lang }: { lang: Language }) {
  const t = getDictionary(lang).booking;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const privacyApproved = process.env.PRIVACY_COPY_APPROVED === "true";
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const challengeRequired = Boolean(process.env.TURNSTILE_SECRET_KEY);
  const validUrl =
    calendlyUrl &&
    privacyApproved &&
    /^https:\/\/calendly\.com\/[a-zA-Z0-9_/-]+$/.test(calendlyUrl);
  const formEnabled = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.QUESTION_TO_EMAIL &&
      process.env.QUESTION_FROM_EMAIL &&
      privacyApproved &&
      (!challengeRequired || turnstileSiteKey),
  );

  return (
    <section id="booking" className="section booking-section">
      <div className="page-shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p className="booking-lead">{t.lead}</p>
        <div className="booking-grid">
          <div
            className={`calendar-panel ${validUrl ? "" : "calendar-pending"}`}
          >
            <h3>{t.chooseTime}</h3>
            {validUrl ? (
              <>
                <iframe
                  title={t.calendarTitle}
                  src={calendlyUrl}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <p>
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.openCalendar} ↗
                  </a>
                </p>
              </>
            ) : (
              <p className="configuration-note">{t.calendarPending}</p>
            )}
          </div>
          <QuestionForm lang={lang} enabled={formEnabled} />
        </div>
      </div>
    </section>
  );
}
