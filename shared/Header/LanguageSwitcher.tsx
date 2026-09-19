import Link from "next/link";

interface LanguageSwitcherProps {
  lang: string;
}

export default function LanguageSwitcher({lang}: LanguageSwitcherProps) {
  console.log("LANG:", lang);
  return (
    <div className="hidden md:flex items-center gap-3 text-[14px] uppercase">
      <Link 
        href="/en"
        className={
          lang === "en" 
          ? "text-gold"
          : "text-navy"
        }
      >
        EN
      </Link>

      <span className="text-neutral-300"> | </span>

      <Link 
        href="/ru"
        className={
          lang === "ru" 
          ? "text-gold"
          : "text-navy"
        }
      >
        RU
      </Link>
    </div>
)}
