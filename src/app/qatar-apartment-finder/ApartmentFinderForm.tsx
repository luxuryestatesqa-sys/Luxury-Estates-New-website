"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  BEDROOM_OPTIONS,
  BEDROOM_OPTIONS_AR,
  BUYER_TYPE_OPTIONS,
  BUYER_TYPE_OPTIONS_AR,
  DOWN_PAYMENT_OPTIONS,
  DOWN_PAYMENT_OPTIONS_AR,
  LOCATION_OPTIONS,
  LOCATION_OPTIONS_AR,
  MONTHLY_INSTALLMENT_OPTIONS,
  MONTHLY_INSTALLMENT_OPTIONS_AR,
  TIMELINE_OPTIONS,
  TIMELINE_OPTIONS_AR,
  WHATSAPP,
  buildWaLink,
  trackWhatsAppClick,
} from "./constants";

const PHONE_PATTERN = /^[+\d][\d\s-]{6,17}$/;
const TOTAL_STEPS = 6;

type Answers = {
  buyerType: string;
  location: string;
  bedrooms: string;
  downPayment: string;
  monthlyInstallment: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
};

const EMPTY_ANSWERS: Answers = {
  buyerType: "",
  location: "",
  bedrooms: "",
  downPayment: "",
  monthlyInstallment: "",
  timeline: "",
  name: "",
  phone: "",
  email: "",
};

const TEXT = {
  en: {
    stepOf: (step: number) => `Step ${step} of ${TOTAL_STEPS}`,
    q1: "Are you looking to move in now, or buy off-plan?",
    q2: "Where would you like to buy?",
    q3: "How many bedrooms do you need?",
    q4a: "What's your down payment range?",
    q4b: "What's your comfortable monthly installment?",
    q5: "When are you looking to buy?",
    q6: "Almost done — where should we send your matches?",
    name: "Full Name",
    phone: "WhatsApp Number",
    phonePlaceholder: "+974 XXXX XXXX",
    email: "Email (optional)",
    back: "Back",
    next: "Next",
    submit: "Get My Matches",
    sending: "Sending…",
    invalidPhone: "Please enter a valid WhatsApp number.",
    genericError: "Something went wrong. Please try again or contact us directly.",
    thankYou: "You're All Set!",
    thankYouBody:
      "Your property match request has been received. Our advisor will contact you shortly with the best Lease-to-Own and Off-Plan options for you.",
    continueWa: "Continue on WhatsApp",
    footnote: "Our property advisor will contact you with the best available matches. No spam, ever.",
    waText: (a: Answers) =>
      [
        `Hi, I'm ${a.name}. I'm looking for a ${a.buyerType} apartment in Qatar.`,
        `Location: ${a.location}`,
        `Bedrooms: ${a.bedrooms}`,
        `Down payment: ${a.downPayment}`,
        `Monthly installment: ${a.monthlyInstallment}`,
        `Timeline: ${a.timeline}`,
        `Phone: ${a.phone}`,
        a.email ? `Email: ${a.email}` : null,
      ],
  },
  ar: {
    stepOf: (step: number) => `الخطوة ${step} من ${TOTAL_STEPS}`,
    q1: "هل ترغب بالانتقال الآن أم الشراء على الخارطة؟",
    q2: "أين ترغب بالشراء؟",
    q3: "كم غرفة نوم تحتاج؟",
    q4a: "ما هو نطاق الدفعة الأولى لديك؟",
    q4b: "ما هو القسط الشهري المريح لك؟",
    q5: "متى ترغب بالشراء؟",
    q6: "أوشكنا على الانتهاء — إلى أين نرسل لك أفضل الخيارات؟",
    name: "الاسم الكامل",
    phone: "رقم الواتساب",
    phonePlaceholder: "+974 XXXX XXXX",
    email: "البريد الإلكتروني (اختياري)",
    back: "رجوع",
    next: "التالي",
    submit: "احصل على خياراتي",
    sending: "جارٍ الإرسال…",
    invalidPhone: "يرجى إدخال رقم واتساب صحيح.",
    genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.",
    thankYou: "كل شيء جاهز!",
    thankYouBody:
      "تم استلام طلب المطابقة العقارية الخاص بك. سيتواصل معك مستشارنا قريباً بأفضل خيارات التملك بالإيجار والشراء على الخارطة المناسبة لك.",
    continueWa: "المتابعة عبر واتساب",
    footnote: "سيتواصل معك مستشارنا العقاري بأفضل الخيارات المتاحة. بدون أي رسائل مزعجة أبداً.",
    waText: (a: Answers) =>
      [
        `مرحباً، أنا ${a.name}. أبحث عن شقة ${a.buyerType} في قطر.`,
        `الموقع: ${a.location}`,
        `عدد الغرف: ${a.bedrooms}`,
        `الدفعة الأولى: ${a.downPayment}`,
        `القسط الشهري: ${a.monthlyInstallment}`,
        `الجدول الزمني: ${a.timeline}`,
        `الهاتف: ${a.phone}`,
        a.email ? `البريد الإلكتروني: ${a.email}` : null,
      ],
  },
};

function canAdvance(step: number, a: Answers) {
  if (step === 1) return a.buyerType !== "";
  if (step === 2) return a.location !== "";
  if (step === 3) return a.bedrooms !== "";
  if (step === 4) return a.downPayment !== "" && a.monthlyInstallment !== "";
  if (step === 5) return a.timeline !== "";
  return true;
}

function StepProgress({ step, lang }: { step: number; lang: "en" | "ar" }) {
  const t = TEXT[lang];
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          {t.stepOf(step)}
        </p>
        <p className="text-xs font-semibold text-gold-600">
          {Math.round((step / TOTAL_STEPS) * 100)}%
        </p>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < step ? "bg-gold-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function OptionGroup({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  columns?: 2 | 4;
}) {
  return (
    <div className={`grid gap-3 ${columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt)}
            className={`flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3.5 text-start text-sm font-semibold transition ${
              selected
                ? "border-gold-500 bg-gold-50 text-ink-900"
                : "border-gray-200 bg-white text-ink-700 hover:border-gray-300"
            }`}
          >
            {opt}
            {selected && <Check className="h-4 w-4 shrink-0 text-gold-600" strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );
}

export default function ApartmentFinderForm({
  idPrefix,
  lang = "en",
}: {
  idPrefix: string;
  lang?: "en" | "ar";
}) {
  const t = TEXT[lang];
  const buyerTypeOptions = lang === "ar" ? BUYER_TYPE_OPTIONS_AR : BUYER_TYPE_OPTIONS;
  const locationOptions = lang === "ar" ? LOCATION_OPTIONS_AR : LOCATION_OPTIONS;
  const bedroomOptions = lang === "ar" ? BEDROOM_OPTIONS_AR : BEDROOM_OPTIONS;
  const downPaymentOptions = lang === "ar" ? DOWN_PAYMENT_OPTIONS_AR : DOWN_PAYMENT_OPTIONS;
  const monthlyInstallmentOptions =
    lang === "ar" ? MONTHLY_INSTALLMENT_OPTIONS_AR : MONTHLY_INSTALLMENT_OPTIONS;
  const timelineOptions = lang === "ar" ? TIMELINE_OPTIONS_AR : TIMELINE_OPTIONS;
  const headingFont = lang === "ar" ? "font-[family-name:var(--font-amiri)]" : "font-serif";

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState(`https://wa.me/${WHATSAPP}`);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (!canAdvance(step, answers)) return;
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.gtag("event", "form_submit", {
      event_category: "engagement",
      event_label: "qatar_apartment_finder_landing_page",
    });
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!PHONE_PATTERN.test(phone)) {
      setError(t.invalidPhone);
      return;
    }

    const finalAnswers: Answers = { ...answers, name, phone, email };
    setAnswers(finalAnswers);
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
        email,
        interest: `${finalAnswers.buyerType} — ${finalAnswers.bedrooms}`,
        message: `Buyer type: ${finalAnswers.buyerType}. Location: ${finalAnswers.location}. Bedrooms: ${finalAnswers.bedrooms}. Down payment: ${finalAnswers.downPayment}. Monthly installment: ${finalAnswers.monthlyInstallment}. Timeline: ${finalAnswers.timeline}.`,
        source: "qatar-apartment-finder",
        source_reference: lang === "ar" ? "property-match-form-ar" : "property-match-form",
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      const url = buildWaLink(t.waText(finalAnswers).filter(Boolean).join("\n"));
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
      <div className="text-center">
        <p className={`text-xl font-semibold text-ink-900 ${headingFont}`}>{t.thankYou}</p>
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
    <form onSubmit={handleSubmit}>
      <StepProgress step={step} lang={lang} />

      {step === 1 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q1}</h3>
          <div className="mt-4">
            <OptionGroup
              options={buyerTypeOptions}
              value={answers.buyerType}
              onChange={(v) => set("buyerType", v)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q2}</h3>
          <div className="mt-4">
            <OptionGroup
              options={locationOptions}
              value={answers.location}
              onChange={(v) => set("location", v)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q3}</h3>
          <div className="mt-4">
            <OptionGroup
              options={bedroomOptions}
              value={answers.bedrooms}
              onChange={(v) => set("bedrooms", v)}
              columns={4}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q4a}</h3>
            <div className="mt-4">
              <OptionGroup
                options={downPaymentOptions}
                value={answers.downPayment}
                onChange={(v) => set("downPayment", v)}
              />
            </div>
          </div>
          <div>
            <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q4b}</h3>
            <div className="mt-4">
              <OptionGroup
                options={monthlyInstallmentOptions}
                value={answers.monthlyInstallment}
                onChange={(v) => set("monthlyInstallment", v)}
              />
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q5}</h3>
          <div className="mt-4">
            <OptionGroup
              options={timelineOptions}
              value={answers.timeline}
              onChange={(v) => set("timeline", v)}
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q6}</h3>

          <div>
            <label htmlFor={`${idPrefix}-name`} className="mb-1.5 block text-xs font-medium text-gray-500">
              {t.name}
            </label>
            <input
              required
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={answers.name}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-phone`} className="mb-1.5 block text-xs font-medium text-gray-500">
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
              defaultValue={answers.phone}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-start text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-email`} className="mb-1.5 block text-xs font-medium text-gray-500">
              {t.email}
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={answers.email}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-gray-300 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink-900 transition hover:border-ink-900"
          >
            {t.back}
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance(step, answers)}
            className="flex-1 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.02] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {t.next}
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.02] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50"
          >
            {submitting ? t.sending : t.submit}
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">{t.footnote}</p>
    </form>
  );
}
