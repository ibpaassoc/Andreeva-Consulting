import { 
  BookConsultationButton,
  Container, 
  Logo 
} from "@shared/"
import DesktopNav from "./DesktopNav"
import LanguageSwitcher from "./LanguageSwitcher";
import { Language } from "@lib/i18n";

interface HeaderProps {
  lang: Language;
}

export default function Header({lang}:HeaderProps) {
  return (
    <header id="header" className="site-header">
      <Container className="header-inner">
        <Logo lang={lang}/>
        <DesktopNav lang={lang} />
        <LanguageSwitcher lang={lang} />
        <BookConsultationButton lang={lang} />
      </Container>
    </header>
  )
}
