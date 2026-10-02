"use client";

import { getDictionary, type Language } from "@lib/i18n";
import { useConsultationFlow } from "@features/Booking/ConsultationFlow";

interface BookConsultationButtonProps {
  lang: Language;
}

export default function BookConsultationButton({
  lang,
}: BookConsultationButtonProps) {
  const t = getDictionary(lang);
  const { openPicker } = useConsultationFlow();

  return (
    <button
      type="button"
      className="button button-primary"
      onClick={openPicker}
    >
      {t.common.bookConsultation}
    </button>
  );
}
