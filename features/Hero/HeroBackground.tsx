import Image from "next/image";
import { getDictionary, type Language } from "@lib/i18n";

export default function HeroBackground({ lang }: { lang: Language }) {
  return (
    <div className="hero-visual">
      <Image
        src="/images/hero.png"
        alt={getDictionary(lang).common.founderImage}
        sizes="100vw"
        fill
        priority
        className="object-cover object-center"
      />
    </div>
  );
}
