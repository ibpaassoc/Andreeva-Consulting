"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { homePath, navigation } from "@config/navigation";
import { getDictionary, type Language } from "@lib/i18n";

export default function MobileMenu({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { mobileMenu: t, common, navigation: navCopy } = getDictionary(lang);
  const links = navigation(lang);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        ref={triggerRef}
        className="mobile-menu-trigger"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        onClick={() => setOpen(!open)}
      >
        <span className="mobile-menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
        <span aria-hidden="true">{t.label}</span>
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label={navCopy.label}
        >
          <div className="mobile-navigation-inner">
            {links.map((item, index) => (
              <Link
                key={item.href}
                href={`${homePath(lang)}#${item.href}`}
                onClick={() => setOpen(false)}
              >
                <span className="mobile-navigation-title">{item.label}</span>
                <span className="mobile-navigation-description">
                  {t.descriptions[index]}
                </span>
              </Link>
            ))}
            <Link
              className="button button-primary"
              href={`${homePath(lang)}#booking`}
              onClick={() => setOpen(false)}
            >
              {common.bookConsultation}
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
