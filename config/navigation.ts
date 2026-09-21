import type { Language } from "@lib/i18n";
export const homePath = (lang: Language) => lang === "ru" ? "/" : "/en";
export const navigation = (lang: Language) => [
  { label: lang === "ru" ? "Услуги" : "Services", href: "services" },
  { label: lang === "ru" ? "Как работаем" : "Our process", href: "process" },
  { label: lang === "ru" ? "Отзывы" : "Reviews", href: "reviews" },
  { label: "FAQ", href: "faq" },
  { label: lang === "ru" ? "Контакты" : "Contact", href: "contact" },
];
