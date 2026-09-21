import Link from "next/link";
import { homePath, navigation } from "@config/navigation";
import { getDictionary, type Language } from "@lib/i18n";

interface DesktopNavProps {
  lang: Language;
}

export default function DesktopNav({ lang }: DesktopNavProps) {
  return (
    <nav aria-label={getDictionary(lang).navigation.label} className="site-nav">
      {navigation(lang).map((item) => (
        <Link
          key={item.href}
          href={`${homePath(lang)}#${item.href}`}
          className="navLink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
