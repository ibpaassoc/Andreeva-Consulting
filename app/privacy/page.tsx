import type { Metadata } from "next";
import LegalPage from "@features/LegalPage";
export const metadata: Metadata = { title: "Политика конфиденциальности | Andreeva Consulting" };
export default function Page() { return <LegalPage lang="ru" type="privacy" />; }
