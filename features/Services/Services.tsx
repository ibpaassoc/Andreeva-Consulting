"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";
import ServiceCard from "./ServiceCard";
import ServiceDialog from "./ServiceDialog";

gsap.registerPlugin(useGSAP);

export default function Services({ lang }: { lang: Language }) {
  const t = getDictionary(lang).services;
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(
    null,
  );

  useGSAP(
    (_context, contextSafe) => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const reveal = contextSafe(() => {
          gsap.fromTo(
            ".service-card",
            { y: 34, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.68,
              stagger: 0.075,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            reveal();
            observer.disconnect();
          },
          { threshold: 0.12 },
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section section-services"
    >
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
              onOpen={(nextIndex, trigger) => {
                setActiveTrigger(trigger);
                setActiveIndex(nextIndex);
              }}
            />
          ))}
        </div>
      </div>
      <ServiceDialog
        activeIndex={activeIndex}
        lang={lang}
        services={t.items}
        trigger={activeTrigger}
        onSelect={setActiveIndex}
        onDismiss={() => setActiveIndex(null)}
      />
    </section>
  );
}
