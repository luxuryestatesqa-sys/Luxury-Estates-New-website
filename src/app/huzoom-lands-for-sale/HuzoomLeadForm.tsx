"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BUDGET_OPTIONS,
  BUDGET_OPTIONS_AR,
  HUZOOM_WHATSAPP,
  PLOT_SIZE_OPTIONS,
  PLOT_SIZE_OPTIONS_AR,
  buildWaLink,
  trackWhatsAppClick,
} from "./constants";

const PHONE_PATTERN = /^[+\d][\d\s-]{6,17}$/;

const TEXT = {
  en: {
    defaultHeading: "Get Huzoom Land Prices & Availability",
    name: "Full Name",
    phone: "WhatsApp Number",
    phonePlaceholder: "+974 XXXX XXXX",
    plotSize: "Preferred Plot Size",
    selectPlotSize: "Select a plot size",
    budget: "Budget Range",
    selectBudget: "Select a budget range",
    invalidPhone: "Please enter a valid WhatsApp number.",
    genericError: "Something went wrong. Please try again or contact us directly.",
    sending: "Sending…",
    submit: "Get Price & Availability",
    footnote: "Our property advisor will contact you with the latest plot availability, prices and details.",
    thankYou: "Thank You!",
    thankYouBody: "Your Huzoom inquiry has been received. Our property advisor will contact you shortly.",
    continueWa: "Continue on WhatsApp",
    notSpecified: "Not specified",
    waLead: (name: string, plotSize: string, budget: string) =>
      `Hi, I'm ${name}. I'm interested in Huzoom lands for sale.\nPreferred plot size: ${plotSize || "Not specified"}\nBudget range: ${budget || "Not specified"}`,
  },
  ar: {
    defaultHeading: "احصل على أسعار وتوفر أراضي حزوم",
    name: "الاسم الكامل",
    phone: "رقم الواتساب",
    phonePlaceholder: "+974 XXXX XXXX",
    plotSize: "حجم القطعة المفضل",
    selectPlotSize: "اختر حجم القطعة",
    budget: "الميزانية",
    selectBudget: "اختر نطاق الميزانية",
    invalidPhone: "يرجى إدخال رقم واتساب صحيح.",
    genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.",
    sending: "جارٍ الإرسال…",
    submit: "احصل على السعر والتوفر",
    footnote: "سيتواصل معك مستشار العقارات لدينا بأحدث القطع المتاحة والأسعار والتفاصيل.",
    thankYou: "شكراً لك!",
    thankYouBody: "تم استلام طلبك بخصوص أراضي حزوم. سيتواصل معك مستشار العقارات لدينا قريباً.",
    continueWa: "المتابعة عبر واتساب",
    notSpecified: "غير محدد",
    waLead: (name: string, plotSize: string, budget: string) =>
      `مرحباً، أنا ${name}. أنا مهتم بأراضي حزوم المعروضة للبيع.\nحجم القطعة المفضل: ${plotSize || "غير محدد"}\nنطاق الميزانية: ${budget || "غير محدد"}`,
  },
};

export default function HuzoomLeadForm({
  idPrefix,
  heading,
  sourceReference,
  presetPlotSize,
  lang = "en",
}: {
  idPrefix: string;
  heading?: string;
  sourceReference: string;
  presetPlotSize?: string;
  lang?: "en" | "ar";
}) {
  const t = TEXT[lang];
  const plotSizeOptions = lang === "ar" ? PLOT_SIZE_OPTIONS_AR : PLOT_SIZE_OPTIONS;
  const budgetOptions = lang === "ar" ? BUDGET_OPTIONS_AR : BUDGET_OPTIONS;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState(`https://wa.me/${HUZOOM_WHATSAPP}`);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.gtag("event", "form_submit", {
      event_category: "engagement",
      event_label: "huzoom_price_request",
    });
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const plotSize = String(data.get("plotSize") ?? "");
    const budget = String(data.get("budget") ?? "");

    if (!PHONE_PATTERN.test(phone)) {
      setError(t.invalidPhone);
      return;
    }

    setSubmitting(true);

    // window.open() only bypasses popup blockers when called synchronously
    // from the click handler — doing it after the `await` below gets
    // silently blocked in most browsers. Strip the opener manually rather
    // than passing "noopener" (which would make window.open() return null).
    const waTab = window.open("", "_blank");
    if (waTab) waTab.opener = null;

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("leads").insert({
        name,
        phone,
        interest: plotSize,
        message: `Preferred plot size: ${plotSize || t.notSpecified}. Budget range: ${budget || t.notSpecified}.`,
        source: "huzoom-lands-for-sale",
        source_reference: `${sourceReference}${lang === "ar" ? "-ar" : ""}`,
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      const waText = t.waLead(name, plotSize, budget);
      const url = buildWaLink(waText);
      setWaUrl(url);
      setSubmitted(true);
      if (waTab) waTab.location.href = url;
      else window.open(url, "_blank");
    } catch {
      waTab?.close();
      setError(t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold-400/40 bg-gold-50 p-6 text-center sm:p-8">
        <p
          className={`text-xl font-semibold text-ink-900 ${lang === "ar" ? "font-[family-name:var(--font-amiri)]" : "font-serif"}`}
        >
          {t.thankYou}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.thankYouBody}</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsAppClick}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gold-500 hover:text-ink-950 sm:w-auto"
        >
          {t.continueWa}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border-2 border-gold-300 bg-white p-6 shadow-xl shadow-black/5 sm:p-7"
    >
      <h3
        className={`text-xl font-semibold text-ink-900 ${lang === "ar" ? "font-[family-name:var(--font-amiri)]" : "font-serif"}`}
      >
        {heading ?? t.defaultHeading}
      </h3>

      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          {t.name}
        </label>
        <input
          required
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          autoComplete="name"
          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          {t.phone}
        </label>
        <input
          required
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder={t.phonePlaceholder}
          pattern="[+\d][\d\s\-]{6,17}"
          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-start text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-plotSize`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          {t.plotSize}
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-plotSize`}
            name="plotSize"
            defaultValue={presetPlotSize ?? ""}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pe-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              {t.selectPlotSize}
            </option>
            {plotSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
            strokeWidth={1.8}
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-budget`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          {t.budget}
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-budget`}
            name="budget"
            defaultValue=""
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pe-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              {t.selectBudget}
            </option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
            strokeWidth={1.8}
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.02] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50"
      >
        {submitting ? t.sending : t.submit}
      </button>
      <p className="text-center text-xs leading-relaxed text-gray-400">{t.footnote}</p>
    </form>
  );
}
