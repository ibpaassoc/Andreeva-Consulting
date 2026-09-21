import { en } from "./en";
import { ru } from "./ru";

export type Language = "en" | "ru";

export type Service = (typeof en.services.items)[number];

export function getDictionary(lang: Language) {
  return lang === "ru" ? ru : en;
}
