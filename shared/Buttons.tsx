// BookConsultationButton.tsx

import { getDictionary, Language } from "@lib/i18n";
import Link from "next/link";

interface BookConsultationButtonProps {
  lang: Language;
}

export default function BookConsultationButton({
  lang,
}: BookConsultationButtonProps) {

  const t = getDictionary(lang);

  return (
    <Link
      href={`/${lang}/consultation`}
      className="
        inline-flex
        items-center
        justify-center
        rounded-[3]
        bg-[var(--color-gold)]
        px-6
        py-3
        text-sm
        font-medium
        text-white
        transition
        hover:opacity-90
      "
    >
      {t.common.bookConsultation}
    </Link>
  );
}
