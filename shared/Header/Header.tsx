import { BookConsultationButton, Container, Logo } from "@shared/";
import DesktopNav from "./DesktopNav";
import LanguageSwitcher, { type LanguageRoute } from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { Language } from "@lib/i18n";

interface HeaderProps {
  lang: Language;
  route?: LanguageRoute;
}

export default function Header({ lang, route = "home" }: HeaderProps) {
  return (
    <header id="header" className="site-header">
      <Container className="header-inner">
        <Logo lang={lang} />
        <DesktopNav lang={lang} />
        <LanguageSwitcher lang={lang} route={route} />
        <MobileMenu lang={lang} />
        <BookConsultationButton lang={lang} />
      </Container>
    </header>
  );
}
