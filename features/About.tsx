"use client";

import { useRef } from "react";
import Image from "next/image";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionEase,
  motionQueries,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";
import { BookConsultationButton } from "@shared/";

export default function About({ lang }: { lang: Language }) {
  const { about, common } = getDictionary(lang);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: motionQueries.desktop,
          compact: motionQueries.compact,
          finePointer: motionQueries.finePointer,
          reduceMotion: motionQueries.reduce,
        },
        (context) => {
          const { desktop, finePointer, reduceMotion } = context.conditions as {
            desktop: boolean;
            finePointer: boolean;
            reduceMotion: boolean;
          };
          const frame = sectionRef.current?.querySelector<HTMLElement>(
            ".about-image",
          );
          const image = sectionRef.current?.querySelector<HTMLElement>(
            ".about-image img",
          );
          const copy = gsap.utils.toArray<HTMLElement>(
            ".about-copy > *:not(.eyebrow)",
            sectionRef.current,
          );
          const stats = gsap.utils.toArray<HTMLElement>(
            "[data-stat-value]",
            sectionRef.current,
          );

          if (!frame || !image || reduceMotion) return;

          revealSectionLabel(".about-copy .eyebrow", {
            trigger: sectionRef.current,
            scope: sectionRef.current,
            start: "top 76%",
          });

          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 76%",
              once: true,
            },
          });

          reveal
            .fromTo(
              frame,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 0.94,
                ease: motionEase.editorialInOut,
                clearProps: "clipPath",
              },
              0,
            )
            .fromTo(
              image,
              { scale: 1.1 },
              {
                scale: 1,
                duration: 1.15,
                ease: motionEase.editorialInOut,
              },
              0,
            )
            .fromTo(
              copy,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.58,
                stagger: 0.06,
                ease: motionEase.editorial,
                clearProps: "transform,opacity",
              },
              0.3,
            );

          stats.forEach((stat) => {
            const endValue = Number(stat.dataset.statValue ?? "0");
            gsap.fromTo(
              stat,
              { textContent: 0 },
              {
                textContent: endValue,
                duration: 1.15,
                snap: { textContent: 1 },
                ease: "power2.out",
                scrollTrigger: {
                  trigger: stat,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          });

          if (!desktop || !finePointer) return;

          const xTo = gsap.quickTo(image, "xPercent", {
            duration: 0.8,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(image, "yPercent", {
            duration: 0.8,
            ease: "power3.out",
          });

          const onPointerMove = (event: PointerEvent) => {
            const bounds = frame.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            xTo(x * 2.4);
            yTo(y * 1.8);
          };
          const onPointerLeave = () => {
            xTo(0);
            yTo(0);
          };

          frame.addEventListener("pointermove", onPointerMove);
          frame.addEventListener("pointerleave", onPointerLeave);
          return () => {
            frame.removeEventListener("pointermove", onPointerMove);
            frame.removeEventListener("pointerleave", onPointerLeave);
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="about" ref={sectionRef} className="section about-section">
      <div className="page-shell about-layout">
        <div className="about-image">
          <div className="about-image-media">
            <Image
              src="/images/who.jpg"
              fill
              sizes="(max-width: 760px) 100vw, 42vw"
              alt={common.founderImage}
            />
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Andreeva Consulting Inc.</p>
          <h2>{about.title}</h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about-facts">
            <div>
              <strong>
                <span data-stat-value="6" aria-hidden="true">
                  6
                </span>
                <span className="sr-only">6</span>
              </strong>
              <span>{about.support}</span>
            </div>
            <div>
              <strong>
                <span data-stat-value="50" aria-hidden="true">
                  50
                </span>
                <span className="sr-only">50</span>
              </strong>
              <span>{about.states}</span>
            </div>
          </div>
          <BookConsultationButton lang={lang} />
        </div>
      </div>
    </section>
  );
}
