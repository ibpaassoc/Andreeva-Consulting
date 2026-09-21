import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getDictionary, type Language } from "@lib/i18n";
import "./globals.css";

async function requestLanguage(): Promise<Language> {
  return (await headers()).get("x-site-lang") === "en" ? "en" : "ru";
}

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await requestLanguage()).metadata;

  return {
    title: t.defaultTitle,
    description: t.defaultDescription,
  };
}

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lang = await requestLanguage();

  return (
    <html lang={lang}>
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}
