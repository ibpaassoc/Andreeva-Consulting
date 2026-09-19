import { 
  Container, 
  Logo 
} from "@shared/"
import DesktopNav from "./DesktopNav"
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  lang: string;
}

export default function Header({lang}:HeaderProps) {
  return (
    <header className="bg-background-secondary w-full">
      <Container className="flex h-[110px] items-center justify-between">
        <Logo/>
        <DesktopNav lang={lang} />
        <LanguageSwitcher lang={lang} />
        <div></div>
      </Container>
    </header>
  )
}
