import { getDictionary, Language } from "@lib/i18n"

interface TitleSectionProps {
  lang: Language
}

export default function TitleSection ({lang}:TitleSectionProps) {

  const t = getDictionary(lang);
  
  return (
    <div> 
      {/* Eyebrow */}
      <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-gold)]">
        {t.hero.eyebrow}
      </p>

      {/* Heading */}
      <h1 className="font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]">
        {t.hero.title}
      </h1>

      {/* Description */}
      <p className="mt-7 max-w-[570px] text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
        {t.hero.description}
      </p>
    </div>
  )
}
