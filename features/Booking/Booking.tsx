import type { Language } from "@lib/i18n";
import QuestionForm from "./QuestionForm";
export default function Booking({ lang }: { lang: Language }) {
  const ru = lang === "ru";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const validUrl = calendlyUrl && process.env.PRIVACY_COPY_APPROVED === "true" && /^https:\/\/calendly\.com\/[a-zA-Z0-9_/-]+$/.test(calendlyUrl);
  const formEnabled = Boolean(process.env.RESEND_API_KEY && process.env.QUESTION_TO_EMAIL && process.env.QUESTION_FROM_EMAIL && process.env.PRIVACY_COPY_APPROVED === "true");
  return <section id="booking" className="section booking-section"><div className="page-shell">
    <p className="eyebrow">{ru ? "Бесплатная консультация" : "Free consultation"}</p><h2>{ru ? "Давайте посмотрим ваши документы" : "Let’s review your documents"}</h2>
    <p className="booking-lead">{ru ? "За 30 минут обсудим образование и опыт, требования штата и возможный путь. Встреча онлайн, без обязательств." : "In 30 minutes, we’ll discuss your education and experience, state requirements, and possible next steps. Online, with no obligation."}</p>
    <div className="booking-grid"><div className={`calendar-panel ${validUrl ? "" : "calendar-pending"}`}><h3>{ru ? "Выберите время" : "Choose a time"}</h3>
      {validUrl ? <><iframe title={ru ? "Календарь записи на бесплатную консультацию" : "Free consultation booking calendar"} src={calendlyUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /><p><a href={calendlyUrl} target="_blank" rel="noopener noreferrer">{ru ? "Открыть календарь в новой вкладке" : "Open calendar in a new tab"} ↗</a></p></> : <p className="configuration-note">{ru ? "Онлайн-запись появится здесь после подключения календаря компании." : "Online scheduling will appear here once the company calendar is connected."}</p>}
    </div><QuestionForm lang={lang} enabled={formEnabled} /></div>
  </div></section>;
}
