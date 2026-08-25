import { DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_AR, buildWaLink } from "./constants";

const ARIA_LABEL = {
  en: "Chat with a Huzoom property advisor on WhatsApp",
  ar: "تواصل مع مستشار عقارات حزوم عبر واتساب",
};

// Floating WhatsApp bubble on every breakpoint. Below `lg`, HuzoomMobileBar
// docks a full-width bar along the bottom edge, so this is lifted above it
// (bottom-24) to match the same lift pattern WhatsAppButton.tsx uses on
// off-plan pages rather than hiding — keeps the bubble a consistent, familiar
// tap target site-wide instead of mobile users losing it entirely.
export default function HuzoomWhatsAppButton({ lang = "en" }: { lang?: "en" | "ar" }) {
  return (
    <a
      href={buildWaLink(lang === "ar" ? DEFAULT_WA_MESSAGE_AR : DEFAULT_WA_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL[lang]}
      className="fixed bottom-24 end-4 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/25 transition hover:scale-105 sm:end-6 lg:bottom-6 lg:h-14 lg:w-14"
      style={{ background: "linear-gradient(135deg, #c9a24b, #b8923f)" }}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white lg:h-7 lg:w-7">
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.66 1.03 1.05-4.54-.25-.4A9.55 9.55 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.19c-.29-.15-1.7-.84-1.96-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z" />
      </svg>
    </a>
  );
}
