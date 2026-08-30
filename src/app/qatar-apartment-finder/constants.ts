// Shared constants for the standalone Qatar Apartment Finder landing page.
// Reuses the Huzoom campaign's WhatsApp/call number so all leads funnel
// into the same inbox (see huzoom-lands-for-sale/constants.ts).
export const WHATSAPP = "97470896755";
export const PHONE = "+97470896755";

export function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE =
  "Hi, I am interested in Lease-to-Own and Off-Plan Installment apartments in Lusail & The Pearl. Please share the latest available units, prices and payment plans.";

export const DEFAULT_WA_MESSAGE_AR =
  "مرحباً، أنا مهتم بشقق التملك بالإيجار والتقسيط على الخارطة في لوسيل واللؤلؤة. يرجى إرسال أحدث الوحدات المتاحة والأسعار وخطط الدفع.";

export const BUYER_TYPE_OPTIONS = ["Ready to Move-In", "Off-Plan"] as const;
export const BUYER_TYPE_OPTIONS_AR = ["جاهزة للسكن", "على الخارطة"] as const;

export const LOCATION_OPTIONS = ["Lusail", "The Pearl", "Both"] as const;
export const LOCATION_OPTIONS_AR = ["لوسيل", "اللؤلؤة", "كلاهما"] as const;

export const BEDROOM_OPTIONS = ["Studio", "1 Bedroom", "2 Bedroom", "3+ Bedroom"] as const;
export const BEDROOM_OPTIONS_AR = ["استوديو", "غرفة نوم واحدة", "غرفتا نوم", "3+ غرف نوم"] as const;

export const DOWN_PAYMENT_OPTIONS = [
  "QAR 50,000",
  "QAR 50,000 – 100,000",
  "QAR 100,000 – 200,000",
  "QAR 200,000+",
] as const;

export const DOWN_PAYMENT_OPTIONS_AR = [
  "50,000 ريال قطري",
  "50,000 – 100,000 ريال قطري",
  "100,000 – 200,000 ريال قطري",
  "200,000+ ريال قطري",
] as const;

export const MONTHLY_INSTALLMENT_OPTIONS = [
  "QAR 10,000",
  "QAR 10,000 – 15,000",
  "QAR 15,000 – 20,000",
  "QAR 20,000+",
] as const;

export const MONTHLY_INSTALLMENT_OPTIONS_AR = [
  "10,000 ريال قطري",
  "10,000 – 15,000 ريال قطري",
  "15,000 – 20,000 ريال قطري",
  "20,000+ ريال قطري",
] as const;

export const TIMELINE_OPTIONS = [
  "Ready to move in",
  "Within 3 months",
  "3–6 months",
  "Off-Plan (2026–2027)",
] as const;

export const TIMELINE_OPTIONS_AR = [
  "جاهز للانتقال الآن",
  "خلال 3 أشهر",
  "3–6 أشهر",
  "على الخارطة (2026–2027)",
] as const;

// Ambient type only — no new tracking/init logic. gtag.js is already
// loaded site-wide (see src/app/layout.tsx).
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Fires on every WhatsApp CTA on this page. No dedicated Google Ads
// conversion action exists for this campaign yet (unlike Huzoom's
// AW-17479160061/QONQCMbP-ukcEP2h245B) — once one is created, add its
// `send_to` id here as a second gtag('event', 'conversion', ...) call,
// the same way huzoom-lands-for-sale/constants.ts does it.
export function trackWhatsAppClick() {
  window.gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: "qatar_apartment_finder_landing_page",
  });
}

export function trackCallClick() {
  window.gtag("event", "call_click", {
    event_category: "engagement",
    event_label: "qatar_apartment_finder_landing_page",
  });
}
