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
    <header className="sticky top-0 z-50 bg-background-secondary w-full">
      <Container className="flex h-[100px] items-center justify-between">
        <Logo/>
        <DesktopNav lang={lang} />
        <LanguageSwitcher lang={lang} />
        <BookConsultationButton lang={lang} />
      </Container>
    </header>
  )
}
