// Shared constants for the standalone Lusail & Marina Office Finder landing page.
// Reuses the same WhatsApp inbox as the other standalone landing pages so all
// leads funnel into one place (see qatar-apartment-finder/constants.ts).
export const WHATSAPP = "97470896755";
export const PHONE = "+97470896755";

export function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE =
  "Hi, I am interested in commercial office space in Lusail & Marina District. Please share the latest available units, prices and payment plans.";

export const DEFAULT_WA_MESSAGE_AR =
  "مرحباً، أنا مهتم بمساحات مكتبية تجارية في لوسيل ومنطقة المارينا. يرجى إرسال أحدث الوحدات المتاحة والأسعار وخطط الدفع.";

export const LOCATION_OPTIONS = ["Marina District", "Lusail", "Both"] as const;
export const LOCATION_OPTIONS_AR = ["منطقة المارينا", "لوسيل", "كلاهما"] as const;

// Brackets calibrated to the two live offers: Lusail (4% of QAR 2.9M ≈
// QAR 116,000 down) and Marina (4% of QAR 3.9M ≈ QAR 156,000 down, QAR
// 25k–35k/month). Used to qualify leads by budget before they reach the
// contact step — see OfficeQualifierForm.
export const DOWN_PAYMENT_OPTIONS = [
  "QAR 100,000 – 150,000",
  "QAR 150,000 – 200,000",
  "QAR 200,000+",
] as const;

export const DOWN_PAYMENT_OPTIONS_AR = [
  "100,000 – 150,000 ريال قطري",
  "150,000 – 200,000 ريال قطري",
  "200,000+ ريال قطري",
] as const;

export const MONTHLY_PAYMENT_OPTIONS = [
  "QAR 15,000 – 25,000",
  "QAR 25,000 – 35,000",
  "QAR 35,000+",
] as const;

export const MONTHLY_PAYMENT_OPTIONS_AR = [
  "15,000 – 25,000 ريال قطري",
  "25,000 – 35,000 ريال قطري",
  "35,000+ ريال قطري",
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
// `send_to` id here as a second gtag('event', 'conversion', ...) call.
export function trackWhatsAppClick() {
  window.gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: "lusail_marina_office_finder_landing_page",
  });
}

export function trackCallClick() {
  window.gtag("event", "call_click", {
    event_category: "engagement",
    event_label: "lusail_marina_office_finder_landing_page",
  });
}
