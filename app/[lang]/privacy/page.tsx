import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@features/LegalPage";
import { getDictionary } from "@lib/i18n";

export const metadata: Metadata = {
  title: getDictionary("en").metadata.privacyTitle,
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  if ((await params).lang !== "en") notFound();
  return <LegalPage lang="en" type="privacy" />;
}
