import Link from "next/link";
import { getDictionary, type Language } from "@lib/i18n";

export type LanguageRoute = "home" | "terms" | "privacy";

interface LanguageSwitcherProps {
  lang: Language;
  route: LanguageRoute;
}

function localizedPath(lang: Language, route: LanguageRoute) {
  if (route === "home") return lang === "en" ? "/en" : "/";
  return lang === "en" ? `/en/${route}` : `/${route}`;
}

export default function LanguageSwitcher({
  lang,
  route,
}: LanguageSwitcherProps) {
  return (
    <nav
      aria-label={getDictionary(lang).navigation.languageLabel}
      className="language-switcher"
    >
      <Link
        href={localizedPath("en", route)}
        hrefLang="en"
        aria-current={lang === "en" ? "page" : undefined}
        className={lang === "en" ? "text-gold" : "text-navy"}
      >
        EN
      </Link>

      <span className="text-neutral-300"> | </span>

      <Link
        href={localizedPath("ru", route)}
        hrefLang="ru"
        aria-current={lang === "ru" ? "page" : undefined}
        className={lang === "ru" ? "text-gold" : "text-navy"}
      >
        RU
      </Link>
    </nav>
  );
}
