import type { Language } from "@lib/i18n";
import { Header, Footer } from "@shared/";
import Hero from "./Hero";
import Services from "./Services/Services";
export default function HomePage({ lang }: { lang: Language }) {
  return <><Header lang={lang} /><main><Hero lang={lang} /><Services lang={lang} /></main><Footer lang={lang} /></>;
}
