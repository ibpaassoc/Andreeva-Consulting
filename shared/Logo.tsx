import Image from "next/image";
import Link from "next/link";
import { homePath } from "@config/navigation";
import { getDictionary, type Language } from "@lib/i18n";

export default function Logo({ lang }: { lang: Language }) {
  const t = getDictionary(lang).common;

  return (
    <Link href={homePath(lang)} aria-label={t.brandHome}>
      <Image
        src={`/images/logo.png`}
        width={280}
        height={100}
        alt=""
        className="brand-logo"
      />
    </Link>
  );
}
