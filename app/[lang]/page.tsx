import HomePage from "@features/HomePage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Beauty licensing & business support | Andreeva Consulting" };
export function generateStaticParams() { return [{ lang: "en" }]; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <HomePage lang="en" />;
}
