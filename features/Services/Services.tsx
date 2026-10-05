"use client";

import { useRef, useState } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionQueries,
  revealOnScroll,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";
import ServiceCard from "./ServiceCard";
import ServiceDialog from "./ServiceDialog";

export default function Services({ lang }: { lang: Language }) {
  const t = getDictionary(lang).services;
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(
    null,
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: motionQueries.desktop,
          compact: motionQueries.compact,
          reduceMotion: motionQueries.reduce,
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            reduceMotion: boolean;
          };
          if (reduceMotion) return;

          const cards = gsap.utils.toArray<HTMLElement>(
            ".service-card",
            sectionRef.current,
          );
          revealSectionLabel(".section-heading .eyebrow", {
            trigger: sectionRef.current,
            scope: sectionRef.current,
            start: "top 78%",
          });
          revealOnScroll(".section-heading h2, .section-heading > p", {
            trigger: sectionRef.current,
            scope: sectionRef.current,
            y: 22,
            stagger: 0.09,
            start: "top 78%",
          });

          if (desktop) {
            const scene = sceneRef.current;
            const viewport = viewportRef.current;
            const track = trackRef.current;
            const progress = progressRef.current;
            const count = countRef.current;
            if (!scene || !viewport || !track || !progress || !count) return;

            const travel = () =>
              Math.max(0, track.scrollWidth - viewport.clientWidth);

            gsap.set(progress, {
              scaleX: 0,
              transformOrigin: "0% 50%",
            });

            const horizontal = gsap.to(track, {
              x: () => -travel(),
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top top",
                end: () => `+=${Math.max(travel() * 1.08, window.innerHeight * 2.2)}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.82,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  gsap.set(progress, { scaleX: self.progress });
                  const activeIndex = Math.min(
                    cards.length - 1,
                    Math.round(self.progress * (cards.length - 1)),
                  );
                  count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
                },
              },
            });

            cards.forEach((card, index) => {
              gsap.fromTo(
                card,
                {
                  y: index % 2 === 0 ? 44 : 76,
                  scale: 0.955,
                  opacity: 0.46,
                },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontal,
                    start: "left 91%",
                    end: "center 62%",
                    scrub: true,
                  },
                },
              );
            });
          } else {
            cards.forEach((card, index) => {
              revealOnScroll(card, {
                trigger: card,
                x: index % 2 === 0 ? -28 : 28,
                y: 0,
                start: "top 90%",
                clearProps: "transform,opacity,visibility",
              });
            });
          }
        },
      );

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
      <div ref={sceneRef} className="services-scene">
        <div className="page-shell">
          <div className="section-heading services-heading">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2>{t.title}</h2>
            </div>
            <p>{t.description}</p>
          </div>
          <div className="services-progress" aria-hidden="true">
            <span ref={countRef}>01 / {String(t.items.length).padStart(2, "0")}</span>
            <span className="services-progress-track">
              <span ref={progressRef} className="services-progress-fill" />
            </span>
          </div>
        </div>
        <div ref={viewportRef} className="services-viewport">
          <div
            ref={trackRef}
            className="service-grid service-track service-stack"
          >
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
