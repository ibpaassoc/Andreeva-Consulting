import type { Metadata } from "next";
import LegalPage from "@features/LegalPage";
export const metadata: Metadata = { title: "Договор оферты | Andreeva Consulting" };
export default function Page() { return <LegalPage lang="ru" type="terms" />; }
