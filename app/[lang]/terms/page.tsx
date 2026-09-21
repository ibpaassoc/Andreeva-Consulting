import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@features/LegalPage";
export const metadata: Metadata = { title: "Terms of service | Andreeva Consulting" };
export default async function Page({ params }: { params: Promise<{ lang: string }> }) { if ((await params).lang !== "en") notFound(); return <LegalPage lang="en" type="terms" />; }
