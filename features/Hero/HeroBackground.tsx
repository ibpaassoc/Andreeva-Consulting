import Image from "next/image"

export default function HeroBackground() {
  return (
    <div className="hero-visual">
      <Image
        src="/images/hero.png"
        alt="Andreeva Consulting founder image"
        sizes="100vw"
        fill
        priority
        className="object-cover object-center"
      />

    </div>
  )
}
