import Image from "@node_modules/next/image"
import Link from "@node_modules/next/link"

export default function Logo() {
  return (
    <Link
      href={"/#header"}
    >
      <Image
        src={`/images/logo.png`}
        width={280}
        height={100}
        alt="Andreeva Consulting logo"
        className="w-45 md:w-60 lg:w-75 h-auto"
      />
    </Link>
  )
}
