import { getDictionary, Language } from "@lib/i18n";
import { BookConsultationButton } from "@shared/";

interface ButtonSectionProps {
  lang: Language
}

export default function ButtonSection ({lang}:ButtonSectionProps) {
  const t = getDictionary(lang);

  return (
    <div className="mt-10">
      <BookConsultationButton lang={lang} />
      <p className="mt-2 max-w-[570px] text-base  text-[var(--color-text-secondary)] text-sm">
        {t.hero.buttonDescription}
      </p>
    </div>
  )
}
