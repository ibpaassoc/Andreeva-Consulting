import type { Language } from "@lib/i18n";
const copy = {
  ru: { eyebrow: "Прозрачный процесс", title: "Как проходит работа", steps: [
    ["Бесплатная консультация", "Смотрим дипломы, сертификаты и стаж. Проверяем требования вашего штата и обсуждаем, что реально."],
    ["План и список документов", "Вы получаете понятный перечень: что найти, перевести и запросить."],
    ["Подготовка и подача", "Готовим переводы и пакет в формате борда, затем подаём документы."],
    ["Сопровождение до результата", "Отвечаем на запросы борда и держим вас в курсе статуса."],
  ], note: "Лицензию выдаёт state board вашего штата. Мы готовим и подаём документы; решение принимает борд." },
  en: { eyebrow: "A clear process", title: "How we work", steps: [
    ["Free consultation", "We review your credentials and experience, check state requirements, and discuss what is realistic."],
    ["Plan and checklist", "You receive a clear list of documents to find, translate, and request."],
    ["Preparation and filing", "We prepare translations and the board-ready packet, then submit it."],
    ["Support through the decision", "We respond to board requests and keep you informed."],
  ], note: "Your state board issues the license. We prepare and file documents; the board makes the decision." },
};
export default function Process({ lang }: { lang: Language }) {
  const t = copy[lang]; return <section id="process" className="section process-section"><div className="page-shell">
    <p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2>
    <div className="steps">{t.steps.map(([title, description], i) => <div className="step" key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
    <p className="section-note">{t.note}</p>
  </div></section>;
}
