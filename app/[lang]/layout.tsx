import { Header, Footer } from "@shared/"
import {
  type Language
} from "@lib/i18n"
import { ReactNode } from "@node_modules/@types/react"

interface LanguageLayoutProps {
  children: ReactNode,
  params: Promise<{
    lang: Language;
  }>
}

export default async function LanguageLayout({
  children,
  params
}:LanguageLayoutProps) {

  const { lang } = await params

  return (
    <>
      <Header lang={lang}/>
        <main>
          {children}
        </main>
      <Footer/>
    </>
)}
