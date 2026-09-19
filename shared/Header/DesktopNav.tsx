import Link from "next/link"
import { navigation } from "@config/navigation"

interface DesktopNavProps {
  lang: string;
}

export default function DesktopNav({lang}:DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-4">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={`/${lang}${item.href}`}
          className={`navLink`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
