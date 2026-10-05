"use client";

import type { RefObject } from "react";
import {
  gsap,
  motionDuration,
  motionEase,
  motionQueries,
  useGSAP,
} from "@lib/motion";

export function useHeroMotion(sectionRef: RefObject<HTMLElement | null>) {
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
          const visual = sectionRef.current?.querySelector(".hero-visual");
          const image = sectionRef.current?.querySelector(".hero-image");
          const copy = sectionRef.current?.querySelector(".hero-copy-inner");
          const eyebrow = sectionRef.current?.querySelector(
            "[data-hero-eyebrow]",
          );
          const titleLines = gsap.utils.toArray<HTMLElement>(
            ".hero-title-text",
            sectionRef.current,
          );
          const underline = sectionRef.current?.querySelector(
            ".hero-title-underline",
          );
          const secondary = sectionRef.current?.querySelector(
            ".hero-secondary",
          );
          const action = sectionRef.current?.querySelector(
            ".hero-primary-action",
          );
          const note = sectionRef.current?.querySelector(".hero-note");

          if (!visual || !image || !copy) return;

          if (reduceMotion) {
            gsap.set(
              [
                visual,
                image,
                eyebrow,
                ...titleLines,
                underline,
                secondary,
                action,
                note,
              ],
              {
                clearProps: "all",
                opacity: 1,
                x: 0,
                y: 0,
                yPercent: 0,
                scale: 1,
                scaleX: 1,
              },
            );
            return;
          }

          const entrance = gsap.timeline({
            defaults: { ease: motionEase.editorial },
          });

          entrance
            .fromTo(
              visual,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.08,
                ease: motionEase.editorialInOut,
                clearProps: "clipPath",
              },
              0,
            )
            .fromTo(
              image,
              { scale: desktop ? 1.1 : 1.065 },
              {
                scale: 1,
                duration: 1.45,
                ease: motionEase.editorialInOut,
              },
              0,
            )
            .fromTo(
              eyebrow,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: motionDuration.standard },
              0.22,
            )
            .fromTo(
              titleLines,
              { yPercent: 115 },
              {
                yPercent: 0,
                duration: 0.82,
                stagger: 0.1,
                ease: motionEase.editorialInOut,
              },
              0.34,
            )
            .fromTo(
              underline,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.72,
                ease: motionEase.editorialInOut,
              },
              0.92,
            )
            .fromTo(
              secondary,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.58 },
              0.88,
            )
            .fromTo(
              action,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 },
              1.04,
            )
            .fromTo(
              note,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.46 },
              1.14,
            );

          if (desktop) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              })
              .to(image, { scale: 1.045, yPercent: 3, ease: "none" }, 0)
              .to(copy, { y: -92, ease: "none" }, 0)
              .to(
                [secondary, action, note],
                { opacity: 0.18, y: -22, ease: "none" },
                0.08,
              );
          }
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );
}
