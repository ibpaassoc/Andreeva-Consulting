import type { Language } from "@lib/i18n";
const items = {
  ru: ["Работали мастером за границей и хотите легально работать в США", "Уже в США без лицензии и не хотите начинать учёбу заново", "Открываете кабинет или салон", "Переезжаете в другой штат", "Продлеваете или восстанавливаете лицензию", "Открываете компанию и оформляете страховку"],
  en: ["Worked in beauty abroad and want to practice legally in the U.S.", "Already in the U.S. without a license and want to explore your options", "Opening a studio or salon", "Moving to another state", "Renewing or reinstating a license", "Starting a company and arranging insurance"],
};
export default function Audience({ lang }: { lang: Language }) {
  return <section className="section audience-section"><div className="page-shell split-section"><div><p className="eyebrow">{lang === "ru" ? "Для кого" : "Who we help"}</p><h2>{lang === "ru" ? "С чем к нам приходят" : "Where you are now"}</h2></div>
    <ul className="audience-list">{items[lang].map(item => <li key={item}>{item}</li>)}</ul>
  </div></section>;
}
