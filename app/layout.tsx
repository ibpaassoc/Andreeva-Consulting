import { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next";
import { headers } from "next/headers";
export const metadata: Metadata = { title: "Andreeva Consulting | Beauty licensing in the U.S.", description: "Licensing and business support for beauty professionals in the United States." };

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export default async function RootLayout({children}: {children:ReactNode}) {
  const lang = (await headers()).get("x-site-lang") === "en" ? "en" : "ru";

  return (
    <html lang={lang}>
      <body 
        className={`${manrope.variable} ${cormorant.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
