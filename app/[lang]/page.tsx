import HomePage from "@features/HomePage";
import { notFound } from "next/navigation";
export function generateStaticParams() { return [{ lang: "en" }]; }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <HomePage lang="en" />;
}
