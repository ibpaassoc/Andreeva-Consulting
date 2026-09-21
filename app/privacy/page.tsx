import type { Metadata } from "next";
import LegalPage from "@features/LegalPage";
import { getDictionary } from "@lib/i18n";

export const metadata: Metadata = {
  title: getDictionary("ru").metadata.privacyTitle,
};

export default function Page() {
  return <LegalPage lang="ru" type="privacy" />;
}
