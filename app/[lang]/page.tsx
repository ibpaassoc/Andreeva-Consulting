import {
  getDictionary,
  type Language
} from "@lib/i18n"

type Props = {
  params: Promise<{
    lang: Language;
  }>
}

export default async function Homepage({params}: Props) {
  const { lang } = await params;

  const t = await getDictionary(lang);

  return (
    <div>
      <h1>{t.hero.title}</h1>
    </div>
  )
}
