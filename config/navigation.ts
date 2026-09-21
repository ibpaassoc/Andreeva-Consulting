import { getDictionary, type Language } from "@lib/i18n";

export const homePath = (lang: Language) => (lang === "ru" ? "/" : "/en");

export function navigation(lang: Language) {
  const labels = getDictionary(lang).navigation;

  return [
    { label: labels.services, href: "services" },
    { label: labels.process, href: "process" },
    { label: labels.reviews, href: "reviews" },
    { label: labels.faq, href: "faq" },
    { label: labels.contact, href: "contact" },
  ];
}
