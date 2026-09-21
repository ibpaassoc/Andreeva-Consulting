import Image from "next/image"
import Link from "next/link"
import { homePath } from "@config/navigation"
import type { Language } from "@lib/i18n"

export default function Logo({ lang }: { lang: Language }) {
  return (
    <Link
      href={homePath(lang)}
      aria-label="Andreeva Consulting — Home"
    >
      <Image
        src={`/images/logo.png`}
        width={280}
        height={100}
        alt="Andreeva Consulting logo"
        className="brand-logo"
      />
    </Link>
  )
}
