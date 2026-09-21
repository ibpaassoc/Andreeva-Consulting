import { Language } from "@lib/i18n";
import HeroBackground from "./Hero/HeroBackground";
import TitleSection from "./Hero/TitleSection";
import ButtonSection from "./Hero/ButtonSection";

interface HeroProps {
  lang:Language
}

export default function Hero({
  lang
}:HeroProps) {
  return (
    <section className="relative h-[calc(100svh-100px)] overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 h-full max-w-[650px] mx-[7vw] my-[5vw]">
        <TitleSection lang={lang} />
        <ButtonSection lang={lang} />
      </div>
    </section>
  )
}
