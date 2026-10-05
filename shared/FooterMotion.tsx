"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQueries, ScrollTrigger, useGSAP } from "@lib/motion";

export default function FooterMotion({ children }: { children: ReactNode }) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(motionQueries.allow, () => {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap
              .timeline()
              .from(
                ".footer-wordmark span",
                {
                  yPercent: 28,
                  duration: 0.9,
                  stagger: 0.08,
                  ease: "power4.out",
                },
                0,
              )
              .from(
                ".footer-grid > *, .footer-bottom, .footer-disclaimer",
                {
                  y: 14,
                  duration: 0.58,
                  stagger: 0.055,
                  ease: "power3.out",
                  clearProps: "transform",
                },
                0.36,
              );
          },
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            ".footer-wordmark-primary",
            { xPercent: 1.8 },
            { xPercent: -1.8, ease: "none" },
            0,
          )
          .fromTo(
            ".footer-wordmark-secondary",
            { xPercent: -1.8 },
            { xPercent: 1.8, ease: "none" },
            0,
          );
      });

      return () => media.revert();
    },
    { scope: footerRef },
  );

  return (
    <footer id="contact" ref={footerRef} className="site-footer">
      {children}
    </footer>
  );
}
