"use client";

import { useRef } from "react";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionQueries,
  revealOnScroll,
  revealSectionLabel,
  ScrollTrigger,
  useGSAP,
} from "@lib/motion";

export default function Process({ lang }: { lang: Language }) {
  const t = getDictionary(lang).process;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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
          const panels = gsap.utils.toArray<HTMLElement>(
            ".process-panel",
            sectionRef.current,
          );
          const markers = gsap.utils.toArray<HTMLElement>(
            ".process-marker",
            sectionRef.current,
          );
          const fill = sectionRef.current?.querySelector(
            ".process-progress-fill",
          );

          if (reduceMotion) return;

          if (window.location.hash) {
            gsap.set(".process-heading > *", {
              clearProps: "transform,opacity,visibility",
            });
          } else {
            revealSectionLabel(".process-heading .eyebrow", {
              trigger: sectionRef.current,
              scope: sectionRef.current,
              start: "top 78%",
            });
            revealOnScroll(".process-heading h2", {
              trigger: sectionRef.current,
              scope: sectionRef.current,
              x: -30,
              y: 0,
              start: "top 78%",
            });
          }

          if (!desktop) {
            panels.forEach((panel) => {
              revealOnScroll(panel, {
                trigger: panel,
                y: 22,
                start: "top 88%",
              });
            });
            return;
          }

          if (!stageRef.current || !panels.length || !fill) return;

          gsap.set(panels.slice(1), { opacity: 0, y: 36 });
          gsap.set(markers, { autoAlpha: 0.38 });
          gsap.set(markers[0], { autoAlpha: 1 });
          gsap.set(fill, { scaleX: 0, transformOrigin: "0% 50%" });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top 116px",
              end: () => `+=${Math.max(window.innerHeight * 1.75, 1280)}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.72,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline.to(fill, { scaleX: 1, duration: 3, ease: "none" }, 0);

          panels.slice(1).forEach((panel, index) => {
            const previous = panels[index];
            const nextMarker = markers[index + 1];
            const previousMarker = markers[index];
            const position = index + 0.72;

            timeline
              .to(
                previous,
                {
                  y: -28,
                  opacity: 0,
                  duration: 0.3,
                  ease: "power2.in",
                },
                position,
              )
              .fromTo(
                panel,
                { y: 36, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.42,
                  ease: "power3.out",
                  immediateRender: false,
                },
                position + 0.1,
              )
              .to(
                previousMarker,
                { autoAlpha: 0.38, duration: 0.2 },
                position,
              )
              .to(
                nextMarker,
                { autoAlpha: 1, duration: 0.24 },
                position + 0.08,
              );
          });

          let scrollFrame = 0;
          let updateFrame = 0;
          const refreshFrame = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();

            const hashTarget = document.getElementById(
              window.location.hash.slice(1),
            );
            if (!hashTarget) return;

            scrollFrame = window.requestAnimationFrame(() => {
              hashTarget.scrollIntoView({ block: "start" });
              updateFrame = window.requestAnimationFrame(() => {
                ScrollTrigger.update();
              });
            });
          });

          return () => {
            window.cancelAnimationFrame(refreshFrame);
            window.cancelAnimationFrame(scrollFrame);
            window.cancelAnimationFrame(updateFrame);
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="process" ref={sectionRef} className="section process-section">
      <div className="page-shell process-shell">
        <div className="process-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>

        <div ref={stageRef} className="process-stage">
          <div className="process-progress" aria-hidden="true">
            <span className="process-progress-track">
              <span className="process-progress-fill" />
            </span>
            <div className="process-markers">
              {t.steps.map(([, description], index) => (
                <span className="process-marker" key={description}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>

          <div className="process-panels">
            {t.steps.map(([title, description], index) => {
              const titleId = `process-step-${index + 1}`;
              return (
                <article
                  className="process-panel"
                  key={title}
                  aria-labelledby={titleId}
                >
                  <span className="process-panel-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 id={titleId}>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <p className="section-note">{t.note}</p>
      </div>
    </section>
  );
}
