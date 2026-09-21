import Image from "@node_modules/next/image"

export default function HeroBackground() {
  return (
    <>
      <Image
        src="/images/hero.png"
        alt="Andreeva Consulting founder image"
        sizes="100vw"
        fill
        priority
        className="object-cover object-[65%_center] w-full"
      />

      {/* White cover / fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, white 0%, white 15%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0) 70%)",
        }}
      />
    </>
  )
}
