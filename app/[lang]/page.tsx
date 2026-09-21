import Hero from "@features/Hero";
import {
  type Language
} from "@lib/i18n"

type Props = {
  params: Promise<{
    lang: Language;
  }>
}

export default async function Homepage({params}: Props) {
  const { lang } = await params;

  return (
    <Hero lang={lang} />
  )
}
