import HomePage from "@features/HomePage";
import type { Metadata } from "next";
import { getDictionary } from "@lib/i18n";

export const metadata: Metadata = {
  title: getDictionary("ru").metadata.homeTitle,
};

export default function Page() {
  return <HomePage lang="ru" />;
}
