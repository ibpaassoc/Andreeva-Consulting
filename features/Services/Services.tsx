import type { Language } from "@lib/i18n";
import { services } from "./content";
import ServiceCard from "./ServiceCard";
export default function Services({ lang }: { lang: Language }) {
  return <section id="services" className="section section-services"><div className="page-shell">
    <div className="section-heading"><div><p className="eyebrow">{lang === "ru" ? "Наши услуги" : "Our services"}</p><h2>{lang === "ru" ? "Чем мы помогаем" : "How we can help"}</h2></div><p>{lang === "ru" ? "От первого документа до открытого кабинета. Выберите услугу, чтобы узнать подробнее." : "From your first document to an open studio. Explore a service to see the details."}</p></div>
    <div className="service-grid">{services[lang].map((service, index) => <ServiceCard key={service.title} service={service} index={index} lang={lang} />)}</div>
  </div></section>;
}
