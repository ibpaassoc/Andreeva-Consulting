import { getDictionary, type Language } from "@lib/i18n";
import { homePath } from "@config/navigation";

interface BookConsultationButtonProps {
  lang: Language;
}

export default function BookConsultationButton({
  lang,
}: BookConsultationButtonProps) {
  const t = getDictionary(lang);

  return (
    <a href={`${homePath(lang)}#booking`} className="button button-primary">
      {t.common.bookConsultation}
    </a>
  );
}
