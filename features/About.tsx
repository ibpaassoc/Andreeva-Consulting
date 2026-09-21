import Image from "next/image";
import type { Language } from "@lib/i18n";
import { BookConsultationButton } from "@shared/";
export default function About({ lang }: { lang: Language }) {
  return <section id="about" className="section about-section"><div className="page-shell about-layout">
    <div className="about-image"><Image src="/images/hero.png" fill sizes="(max-width: 760px) 100vw, 42vw" alt={lang === "ru" ? "Основательница Andreeva Consulting" : "Andreeva Consulting founder"} /></div>
    <div className="about-copy"><p className="eyebrow">Andreeva Consulting Inc.</p><h2>{lang === "ru" ? "Кто с вами работает" : "Who works with you"}</h2>
      {lang === "ru" ? <><p>Мы помогаем бьюти-мастерам легально работать в США: от получения лицензии до открытия своего дела.</p><p>Основательница компании сама прошла путь от работы в бьюти-индустрии за рубежом до лицензирования в США. Поэтому мы объясняем требования понятным языком и говорим прямо, что возможно в вашем случае.</p></> : <><p>We help beauty professionals work legally in the U.S., from licensing to setting up a business.</p><p>Our founder navigated the path from beauty work abroad to licensing in the U.S. herself. We explain requirements clearly and speak candidly about what is possible in your case.</p></>}
      <div className="about-facts"><div><strong>6</strong><span>{lang === "ru" ? "направлений помощи" : "areas of support"}</span></div><div><strong>50</strong><span>{lang === "ru" ? "штатов с разными правилами" : "states, different rules"}</span></div></div>
      <BookConsultationButton lang={lang} />
    </div>
  </div></section>;
}
