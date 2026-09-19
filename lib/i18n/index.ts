import { en } from "./en"
import { ru } from "./ru"

export type Language = "en" | "ru";

const dictionaries = {
  en,
  ru
}

export function getDictionary(lang: Language) {
  return dictionaries[lang]
}
