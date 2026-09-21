"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
export default function HeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".eyebrow, h1, .hero-description, .hero-facts, .button, .hero-note", { y: 18, autoAlpha: 0, duration: .65, stagger: .09, ease: "power2.out", clearProps: "all" });
    });
    return () => mm.revert();
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
