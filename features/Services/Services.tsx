import { getDictionary, type Language } from "@lib/i18n";
import ServiceCard from "./ServiceCard";

export default function Services({ lang }: { lang: Language }) {
  const t = getDictionary(lang).services;

  return (
    <section id="services" className="section section-services">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2>{t.title}</h2>
          </div>
          <p>{t.description}</p>
        </div>
        <div className="service-grid">
          {t.items.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
