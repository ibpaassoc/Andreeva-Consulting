"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { homePath, navigation } from "@config/navigation";
import { getDictionary, type Language } from "@lib/i18n";
import { useConsultationFlow } from "@features/Booking/ConsultationFlow";

const menuIcons = ["services", "process", "reviews", "faq", "contact"] as const;

type MenuIconName = (typeof menuIcons)[number];

function MenuIcon({ name }: { name: MenuIconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.6,
  };

  if (name === "services") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path {...common} d="M10 5.5h9l5 5v16H10z" />
        <path {...common} d="M19 5.5v5h5M13.5 15h7M13.5 19h7M13.5 23h5" />
      </svg>
    );
  }

  if (name === "process") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect {...common} x="13" y="4" width="6" height="6" rx="1" />
        <rect {...common} x="4" y="22" width="6" height="6" rx="1" />
        <rect {...common} x="13" y="22" width="6" height="6" rx="1" />
        <rect {...common} x="22" y="22" width="6" height="6" rx="1" />
        <path {...common} d="M16 10v6M7 22v-6h18v6M16 16v6" />
      </svg>
    );
  }

  if (name === "reviews") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          {...common}
          d="M26.5 14.5a10.5 10.5 0 0 1-13.8 10l-6.2 2 2-5.5a10.5 10.5 0 1 1 18-6.5Z"
        />
        <path {...common} d="M12 15.5h.1M16 15.5h.1M20 15.5h.1" />
      </svg>
    );
  }

  if (name === "faq") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle {...common} cx="16" cy="16" r="11" />
        <path
          {...common}
          d="M12.8 12.5a3.4 3.4 0 0 1 6.6 1c0 2.7-3.4 2.7-3.4 5M16 23h.1"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect {...common} x="4" y="7" width="24" height="18" rx="1.5" />
      <path {...common} d="m5 9 11 8 11-8" />
    </svg>
  );
}

export default function MobileMenu({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const restoreFocusRef = useRef(false);
  const { mobileMenu: t, common, navigation: navCopy } = getDictionary(lang);
  const links = navigation(lang);
  const { openPicker } = useConsultationFlow();

  useGSAP(
    () => {
      if (!mounted) return;

      const menu =
        rootRef.current?.querySelector<HTMLElement>(".mobile-navigation");
      if (!menu) return;

      const rows = menu.querySelectorAll(".mobile-navigation-item");
      const cta = menu.querySelector(".mobile-navigation-cta");
      const footer = menu.querySelector(".mobile-navigation-signature");
      const iconLines = rootRef.current?.querySelectorAll(
        ".mobile-menu-icon span",
      );
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      timelineRef.current?.kill();

      if (reduceMotion) {
        gsap.set(menu, {
          autoAlpha: open ? 1 : 0,
          clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        });
        gsap.set(rows, { autoAlpha: open ? 1 : 0, y: 0 });
        gsap.set([cta, footer], { autoAlpha: open ? 1 : 0, y: 0 });
        gsap.set(iconLines?.[0] ?? null, {
          rotation: open ? 45 : 0,
          y: open ? 3.5 : 0,
        });
        gsap.set(iconLines?.[1] ?? null, {
          rotation: open ? -45 : 0,
          y: open ? -3.5 : 0,
        });

        if (!open) {
          setMounted(false);
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          action?.();
          if (restoreFocusRef.current) triggerRef.current?.focus();
          restoreFocusRef.current = false;
        }
        return;
      }

      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          if (open) return;

          setMounted(false);
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          action?.();
          if (restoreFocusRef.current) triggerRef.current?.focus();
          restoreFocusRef.current = false;
        },
      });
      timelineRef.current = timeline;

      if (open) {
        gsap.set(menu, {
          autoAlpha: 1,
          clipPath: "inset(0 0 100% 0)",
        });
        gsap.set(rows, { autoAlpha: 0, y: 22 });
        gsap.set([cta, footer], { autoAlpha: 0, y: 18 });

        timeline
          .to(
            menu,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.52,
              ease: "power3.inOut",
            },
            0,
          )
          .to(
            iconLines?.[0] ?? null,
            { rotation: 45, y: 3.5, duration: 0.34, ease: "power3.out" },
            0.06,
          )
          .to(
            iconLines?.[1] ?? null,
            { rotation: -45, y: -3.5, duration: 0.34, ease: "power3.out" },
            0.06,
          )
          .to(
            rows,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.42,
              stagger: 0.055,
              ease: "power3.out",
            },
            0.18,
          )
          .to(
            [cta, footer],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.36,
          );
      } else {
        timeline
          .to(
            [footer, cta, rows],
            {
              autoAlpha: 0,
              y: -10,
              duration: 0.18,
              stagger: 0.018,
              ease: "power2.in",
            },
            0,
          )
          .to(
            menu,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.36,
              ease: "power3.inOut",
            },
            0.08,
          )
          .to(
            iconLines?.[0] ?? null,
            { rotation: 0, y: 0, duration: 0.28, ease: "power3.inOut" },
            0.08,
          )
          .to(
            iconLines?.[1] ?? null,
            { rotation: 0, y: 0, duration: 0.28, ease: "power3.inOut" },
            0.08,
          );
      }
    },
    { scope: rootRef, dependencies: [mounted, open] },
  );

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        restoreFocusRef.current = true;
        setOpen(false);
      }
    }

    function onViewportChange(event: MediaQueryListEvent) {
      if (event.matches) return;

      timelineRef.current?.kill();
      pendingActionRef.current = null;
      restoreFocusRef.current = false;
      setOpen(false);
      setMounted(false);
    }

    window.addEventListener("keydown", onKeyDown);
    mobileViewport.addEventListener("change", onViewportChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      mobileViewport.removeEventListener("change", onViewportChange);
    };
  }, [mounted, open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }

    setMounted(true);
    setOpen(true);
  }

  function closeMenu(action?: () => void) {
    pendingActionRef.current = action ?? null;
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="mobile-menu">
      <button
        ref={triggerRef}
        className="mobile-menu-trigger"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        onClick={toggleMenu}
      >
        <span className="mobile-menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
        <span aria-hidden="true">{t.label}</span>
      </button>
      {mounted && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label={navCopy.label}
        >
          <div className="mobile-navigation-inner">
            <div className="mobile-navigation-links">
              {links.map((item, index) => (
                <Link
                  className="mobile-navigation-item"
                  key={item.href}
                  href={`${homePath(lang)}#${item.href}`}
                  onClick={() => closeMenu()}
                >
                  <span className="mobile-navigation-symbol" aria-hidden="true">
                    <MenuIcon name={menuIcons[index]} />
                  </span>
                  <span className="mobile-navigation-copy">
                    <span className="mobile-navigation-title">
                      {item.label}
                    </span>
                    <span className="mobile-navigation-description">
                      {t.descriptions[index]}
                    </span>
                  </span>
                  <span className="mobile-navigation-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="button button-primary mobile-navigation-cta"
              onClick={() => closeMenu(openPicker)}
            >
              <span>{common.bookConsultation}</span>
              <span aria-hidden="true">→</span>
            </button>
            <div className="mobile-navigation-signature" aria-hidden="true">
              <span />
              <p>Strategy · Growth · Impact</p>
              <span />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
