"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export const motionQueries = {
  desktop: "(min-width: 961px)",
  compact: "(max-width: 960px)",
  mobile: "(max-width: 760px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reduce: "(prefers-reduced-motion: reduce)",
  allow: "(prefers-reduced-motion: no-preference)",
} as const;

export const motionEase = {
  editorial: "power3.out",
  editorialInOut: "power3.inOut",
  gentle: "power2.out",
  settle: "back.out(1.12)",
} as const;

export const motionDuration = {
  quick: 0.24,
  standard: 0.46,
  reveal: 0.76,
} as const;

type RevealOptions = {
  trigger?: Element | string | null;
  scope?: Element | null;
  x?: number;
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
  once?: boolean;
  clearProps?: string;
  fade?: boolean;
};

export function revealOnScroll(
  targets: gsap.TweenTarget,
  {
    trigger,
    scope,
    x = 0,
    y = 28,
    stagger = 0,
    start = "top 84%",
    duration = motionDuration.reveal,
    once = true,
    clearProps = "transform,opacity,visibility",
    fade = true,
  }: RevealOptions = {},
) {
  const targetList = gsap.utils.toArray<Element>(targets, scope ?? undefined);
  if (!targetList.length) return null;
  const resolvedTrigger =
    typeof trigger === "string" && scope
      ? scope.querySelector(trigger)
      : trigger;
  const fromVars: gsap.TweenVars = { x, y };
  const toVars: gsap.TweenVars = {
    x: 0,
    y: 0,
    duration,
    stagger,
    ease: motionEase.editorial,
    clearProps,
    scrollTrigger: {
      trigger: resolvedTrigger ?? targetList[0],
      start,
      once,
    },
  };

  if (fade) {
    fromVars.opacity = 0;
    toVars.opacity = 1;
  }

  return gsap.fromTo(targetList, fromVars, toVars);
}

type SectionLabelOptions = {
  trigger?: Element | string | null;
  scope?: Element | null;
  start?: string;
  once?: boolean;
};

export function revealSectionLabel(
  target: gsap.TweenTarget,
  {
    trigger,
    scope,
    start = "top 84%",
    once = true,
  }: SectionLabelOptions = {},
) {
  const label = gsap.utils.toArray<HTMLElement>(target, scope ?? undefined)[0];
  if (!label) return null;
  const resolvedTrigger =
    typeof trigger === "string" && scope
      ? scope.querySelector(trigger)
      : trigger;

  return gsap
    .timeline({
      scrollTrigger: {
        trigger: resolvedTrigger ?? label,
        start,
        once,
      },
    })
    .fromTo(
      label,
      {
        x: -14,
        clipPath: "inset(0 100% 0 0)",
        "--motion-label-line": 0,
      },
      {
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        "--motion-label-line": 1,
        duration: 0.72,
        ease: motionEase.editorialInOut,
        clearProps: "transform,clipPath",
      },
    );
}

export { gsap, ScrollTrigger, useGSAP };
