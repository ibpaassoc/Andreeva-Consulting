import Link from "next/link";
import { getDictionary, type Language } from "@lib/i18n";

interface LanguageSwitcherProps {
  lang: Language;
}

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  return (
    <nav
      aria-label={getDictionary(lang).navigation.languageLabel}
      className="language-switcher"
    >
      <Link
        href="/en"
        hrefLang="en"
        aria-current={lang === "en" ? "page" : undefined}
        className={lang === "en" ? "text-gold" : "text-navy"}
      >
        EN
      </Link>

      <span className="text-neutral-300"> | </span>

      <Link
        href="/"
        hrefLang="ru"
        aria-current={lang === "ru" ? "page" : undefined}
        className={lang === "ru" ? "text-gold" : "text-navy"}
      >
        RU
      </Link>
    </nav>
  );
}
