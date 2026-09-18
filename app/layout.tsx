import { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export default function RootLayout({children}: {children: ReactNode}) {

  return (
    <html>
      <body 
        className={`${manrope.variable} ${cormorant.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
