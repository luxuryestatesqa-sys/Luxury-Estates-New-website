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

// Ambient type only — no new tracking/init logic. Needed so the direct
// window.gtag(...) calls added for whatsapp_click/form_submit tracking
// type-check; gtag.js is already loaded site-wide (see src/app/layout.tsx).
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Fires on every WhatsApp CTA on this landing page: the GA4 engagement
// event plus the Google Ads "Huzoom - Whatsapp Clicks" conversion
// (AW-17479160061/QONQCMbP-ukcEP2h245B), so ad spend can attribute to
// these clicks. Kept here instead of duplicated per component.
export function trackWhatsAppClick() {
  window.gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: "huzoom_landing_page",
  });
  window.gtag("event", "conversion", {
    send_to: "AW-17479160061/QONQCMbP-ukcEP2h245B",
  });
}
