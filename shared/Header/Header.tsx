"use client";

import { useRef } from "react";
import { BookConsultationButton, Container, Logo } from "@shared/";
import DesktopNav from "./DesktopNav";
import LanguageSwitcher, { type LanguageRoute } from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { Language } from "@lib/i18n";
import {
  gsap,
  motionQueries,
  ScrollTrigger,
  useGSAP,
} from "@lib/motion";

interface HeaderProps {
  lang: Language;
  route?: LanguageRoute;
}

export default function Header({ lang, route = "home" }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(motionQueries.desktop, () => {
        const header = headerRef.current;
        if (!header) return;

        const setCondensed = (condensed: boolean) => {
          header.classList.toggle("is-condensed", condensed);
        };

        setCondensed(window.scrollY >= 100);
        const trigger = ScrollTrigger.create({
          id: "site-header-state",
          start: 100,
          end: "max",
          onEnter: () => setCondensed(true),
          onLeaveBack: () => setCondensed(false),
        });

        return () => {
          trigger.kill();
          setCondensed(false);
        };
      });

      return () => media.revert();
    },
    { scope: headerRef },
  );

  return (
    <header id="header" ref={headerRef} className="site-header">
      <Container className="header-inner">
        <Logo lang={lang} />
        <DesktopNav lang={lang} />
        <LanguageSwitcher lang={lang} route={route} />
        <MobileMenu lang={lang} />
        <BookConsultationButton lang={lang} />
      </Container>
    </header>
  );
}
