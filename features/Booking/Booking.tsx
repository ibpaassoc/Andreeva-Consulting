"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";
import { useConsultationFlow } from "./ConsultationFlow";
import { consultations, type ConsultationKey } from "./consultations";

gsap.registerPlugin(useGSAP);

function ConsultationArtwork({ type }: { type: ConsultationKey }) {
  if (type === "immigration") {
    return (
      <div className="consultation-art consultation-art-immigration" aria-hidden="true">
        <span className="passport-mark">AC</span>
        <span className="passport-label">United States</span>
        <span className="passport-title">Passport</span>
        <span className="consultation-art-pen" />
      </div>
    );
  }

  return (
    <div className="consultation-art consultation-art-license" aria-hidden="true">
      <span className="license-kicker">State board</span>
      <span className="license-title">Professional license</span>
      <span className="license-rule license-rule-one" />
      <span className="license-rule license-rule-two" />
      <span className="license-seal">AC</span>
    </div>
  );
}

function BookingIcon({ type }: { type: "video" | "calendar" | "secure" }) {
  if (type === "video") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="6" width="11" height="12" rx="2" />
        <path d="m14.5 10 5-2.5v9l-5-2.5" />
      </svg>
    );
  }
  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="15" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 19 6v5.5c0 4.3-2.8 7.5-7 9-4.2-1.5-7-4.7-7-9V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function Booking({ lang }: { lang: Language }) {
  const t = getDictionary(lang).booking;
  const sectionRef = useRef<HTMLElement>(null);
  const { openCalendar } = useConsultationFlow();

  useGSAP(
    (_context, contextSafe) => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const reveal = contextSafe(() => {
          gsap.fromTo(
            ".consultation-intro > *, .consultation-card",
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.09,
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
          { threshold: 0.14 },
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
      id="booking"
      ref={sectionRef}
      className="section booking-section"
      aria-labelledby="booking-title"
    >
      <div className="page-shell consultation-layout">
        <div className="consultation-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="booking-title">{t.title}</h2>
          <p className="booking-lead">{t.lead}</p>

          <ul className="consultation-assurances">
            <li>
              <span className="assurance-icon">
                <BookingIcon type="video" />
              </span>
              <span>
                <strong>{t.assurances.online.title}</strong>
                {t.assurances.online.detail}
              </span>
            </li>
            <li>
              <span className="assurance-icon">
                <BookingIcon type="calendar" />
              </span>
              <span>
                <strong>{t.assurances.schedule.title}</strong>
                {t.assurances.schedule.detail}
              </span>
            </li>
            <li>
              <span className="assurance-icon">
                <BookingIcon type="secure" />
              </span>
              <span>
                <strong>{t.assurances.calcom.title}</strong>
                {t.assurances.calcom.detail}
              </span>
            </li>
          </ul>
        </div>

        <div className="consultation-cards" aria-label={t.optionsLabel}>
          {consultations.map((consultation, index) => {
            const item = t.items[index];

            return (
              <article
                key={consultation.key}
                className={`consultation-card consultation-card-${consultation.key}`}
              >
                <ConsultationArtwork type={consultation.key} />
                <div className="consultation-card-body">
                  <div className="consultation-meta">
                    <span>{item.topic}</span>
                    <span>{item.price}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="consultation-description">{item.description}</p>
                  <div className="consultation-duration">
                    <BookingIcon type="video" />
                    <span>{item.format}</span>
                    <span aria-hidden="true">·</span>
                    <BookingIcon type="calendar" />
                    <span>{item.duration}</span>
                  </div>
                  <p className="consultation-disclaimer">
                    <span aria-hidden="true">i</span>
                    {item.disclaimer}
                  </p>
                  <button
                    type="button"
                    className="button consultation-book-button"
                    onClick={() => openCalendar(consultation.key)}
                  >
                    <span>{item.button}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
