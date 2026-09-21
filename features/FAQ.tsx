import type { Language } from "@lib/i18n";
const questions = {
  ru: [
    ["Зачтут ли мои дипломы и опыт, полученные не в США?", "Во многих штатах это возможно при правильно оформленных документах. Требования различаются: иногда нужны дополнительные часы или экзамен. На консультации проверим ваш случай."],
    ["Сколько времени занимает получение лицензии?", "Ориентир — от 7 дней до 4 месяцев. Основная часть срока зависит от рассмотрения в борде и готовности ваших документов; гарантировать дату нельзя."],
    ["Можно ли работать без лицензии?", "Требования к лицензированию устанавливает штат. Работа без необходимой лицензии может повлечь санкции; сначала проверьте правила для вашей специальности и помещения."],
    ["Обязательно ли идти в американский колледж?", "Не всегда. В некоторых штатах можно зачесть образование и стаж из-за рубежа. Проверим правила и ваши документы, прежде чем рекомендовать путь."],
    ["Нужна ли грин-карта, чтобы получить лицензию?", "Требования к документам и праву на работу зависят от штата и обстоятельств. Мы проверяем лицензионные требования, но не даём иммиграционных или юридических консультаций."],
    ["А если в моём штате нужен экзамен?", "Мы готовим и подаём документы и помогаем получить допуск. К подготовке направляем к партнёрам с готовым курсом; сами к экзамену не готовим."],
    ["У меня нет опыта и образования в бьюти. Вы поможете?", "На бесплатной консультации разберём вашу ситуацию. Если зачитывать нечего, прямо расскажем, какие варианты обучения и лицензирования существуют в вашем штате."],
    ["Сколько стоят ваши услуги?", "Стоимость зависит от штата, специальности и имеющихся документов. Обсудим её на бесплатной консультации после оценки вашего случая."],
    ["Вы юридическая компания?", "Нет. Мы оказываем консультационные услуги и помогаем готовить и подавать документы. Мы не юридическая фирма и не даём юридических консультаций."],
    ["Вы работаете с мастерами вне Калифорнии?", "Да, консультации проходят онлайн. Требования и возможность подачи проверяются индивидуально для вашего штата."],
  ],
  en: [
    ["Will my education and experience from outside the U.S. count?", "In many states, they can when properly documented. Requirements differ; additional hours or an exam may apply. We review your case during the consultation."],
    ["How long does licensing take?", "A planning range is 7 days to 4 months. Board processing and document readiness drive the timeline; a specific date cannot be guaranteed."],
    ["Can I work without a license?", "States set licensing requirements. Working without a required license can carry penalties; check the rules for your specialty and workplace first."],
    ["Do I have to attend an American college?", "Not always. Some states recognize foreign education and experience. We check your documents and state rules before suggesting a path."],
    ["Do I need a green card to obtain a license?", "Documentation and work-authorization requirements depend on the state and your circumstances. We review licensing rules but do not provide immigration or legal advice."],
    ["What if my state requires an exam?", "We prepare and file documents and help obtain exam eligibility. Vetted course partners handle preparation; we do not teach the exam ourselves."],
    ["I have no beauty education or experience. Can you help?", "We can review your situation in a free consultation. If there is nothing to credit, we will explain the education and licensing paths available in your state."],
    ["How much do your services cost?", "Pricing depends on the state, specialty, and documents you already have. We discuss it after reviewing your case in a free consultation."],
    ["Are you a law firm?", "No. We offer consulting and document preparation and filing support. We are not a law firm and do not provide legal advice."],
    ["Do you work outside California?", "Yes. Consultations are online, and we review the requirements and filing options for your state individually."],
  ],
};
export default function FAQ({ lang }: { lang: Language }) {
  return <section id="faq" className="section faq-section"><div className="page-shell split-section"><div><p className="eyebrow">FAQ</p><h2>{lang === "ru" ? "Частые вопросы" : "Frequently asked questions"}</h2></div>
    <div className="faq-list">{questions[lang].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
  </div></section>;
}
