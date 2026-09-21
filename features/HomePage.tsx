import type { Language } from "@lib/i18n";
import { Header, Footer } from "@shared/";
import Hero from "./Hero";
import Services from "./Services/Services";
import Process from "./Process";
import Audience from "./Audience";
import About from "./About";
import Reviews from "./Reviews/Reviews";
import ExamStates from "./ExamStates";
import FAQ from "./FAQ";
import Booking from "./Booking/Booking";
export default function HomePage({ lang }: { lang: Language }) {
  return <><Header lang={lang} /><main><Hero lang={lang} /><Services lang={lang} /><Process lang={lang} /><Audience lang={lang} /><About lang={lang} /><Reviews lang={lang} /><ExamStates lang={lang} /><FAQ lang={lang} /><Booking lang={lang} /></main><Footer lang={lang} /></>;
}
