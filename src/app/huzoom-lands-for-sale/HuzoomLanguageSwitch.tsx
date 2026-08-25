import Link from "next/link";
import { Languages } from "lucide-react";

const TEXT = {
  en: { label: "العربية", href: "/huzoom-lands-for-sale/ar" },
  ar: { label: "English", href: "/huzoom-lands-for-sale" },
};

// Rendered inside the hero <section> (which is `relative isolate`), not
// fixed to the viewport — sits directly on the hero's own cream gradient
// instead of needing a separate colored strip that clashes with the black
// marquee above it. `end-4` sits top-right on English, top-left on Arabic.
export default function HuzoomLanguageSwitch({ lang = "en" }: { lang?: "en" | "ar" }) {
  const t = TEXT[lang];
  return (
    <Link
      href={t.href}
      className="absolute top-4 end-4 z-20 flex items-center gap-1.5 rounded-full border border-gold-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-800 shadow-sm transition hover:border-gold-400 hover:text-gold-600 sm:top-5 sm:end-6"
    >
      <Languages className="h-3.5 w-3.5 text-gold-600" strokeWidth={2} />
      {t.label}
    </Link>
  );
}
