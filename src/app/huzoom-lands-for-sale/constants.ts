// Shared constants for the standalone Huzoom Lands for Sale landing page.
// This number is specific to Huzoom leads and is intentionally different
// from the main site's company WhatsApp number in WhatsAppButton.tsx.
export const HUZOOM_WHATSAPP = "97470896755";
export const HUZOOM_PHONE = "+97470896755";

export function buildWaLink(message: string) {
  return `https://wa.me/${HUZOOM_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE =
  "Hi, I am interested in Huzoom lands for sale. Please share the latest available plots, prices and details.";

export const DEFAULT_WA_MESSAGE_AR =
  "مرحباً، أنا مهتم بأراضي حزوم المعروضة للبيع. يرجى إرسال أحدث القطع المتاحة والأسعار والتفاصيل.";

export const PLOT_SIZE_OPTIONS = [
  "400 SQM — Standard Villa Plot",
  "480–555 SQM — Medium Residential Plot",
  "555 SQM — Premium Corner / Dual Street",
  "800+ SQM — Large Estate / Sea View Plot",
  "Not sure yet — please advise",
] as const;

export const PLOT_SIZE_OPTIONS_AR = [
  "400 م² — قطعة فيلا قياسية",
  "480–555 م² — قطعة سكنية متوسطة",
  "555 م² — زاوية مميزة / شارعين",
  "800+ م² — قطعة كبيرة / إطلالة بحرية",
  "غير محدد بعد — يرجى النصح",
] as const;

export const BUDGET_OPTIONS = [
  "Under QAR 2,000,000",
  "QAR 2,000,000 – 2,500,000",
  "QAR 2,500,000 – 3,500,000",
  "QAR 3,500,000+",
  "Flexible / not sure",
] as const;

export const BUDGET_OPTIONS_AR = [
  "أقل من 2,000,000 ريال قطري",
  "2,000,000 – 2,500,000 ريال قطري",
  "2,500,000 – 3,500,000 ريال قطري",
  "أكثر من 3,500,000 ريال قطري",
  "مرن / غير محدد",
] as const;

/** Fires a conversion event only if a tag manager already exists on the page — this
 *  page adds no analytics script of its own, matching the site's no-analytics-cookies policy. */
export function trackHuzoomEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  if (typeof w.gtag === "function") w.gtag("event", name, params);
  else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...params });
}
