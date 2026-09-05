"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  DOWN_PAYMENT_OPTIONS,
  DOWN_PAYMENT_OPTIONS_AR,
  LOCATION_OPTIONS,
  LOCATION_OPTIONS_AR,
  MONTHLY_PAYMENT_OPTIONS,
  MONTHLY_PAYMENT_OPTIONS_AR,
  WHATSAPP,
  buildWaLink,
  trackWhatsAppClick,
} from "./constants";

const PHONE_PATTERN = /^[+\d][\d\s-]{6,17}$/;
const TOTAL_STEPS = 4;

type Answers = {
  location: string;
  downPayment: string;
  monthlyPayment: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

const EMPTY_ANSWERS: Answers = {
  location: "",
  downPayment: "",
  monthlyPayment: "",
  name: "",
  company: "",
  email: "",
  phone: "",
};

const TEXT = {
  en: {
    stepOf: (step: number) => `Step ${step} of ${TOTAL_STEPS}`,
    q1: "Where would you like to buy?",
    q2: "What's your down payment budget?",
    q3: "What's your comfortable monthly payment?",
    q4: "Almost done — where should we send your match?",
    name: "Full Name",
    company: "Company Name",
    email: "Business Email",
    phone: "Phone / WhatsApp Number",
    phonePlaceholder: "+974 XXXX XXXX",
    back: "Back",
    next: "Next",
    submit: "Get My Office Match",
    sending: "Sending…",
    invalidPhone: "Please enter a valid WhatsApp number.",
    genericError: "Something went wrong. Please try again or contact us directly.",
    thankYou: "You're All Set!",
    thankYouBody:
      "Your office match request has been received. Our commercial leasing advisor will contact you shortly with floor plans, pricing and the payment schedule.",
    continueWa: "Continue on WhatsApp",
    footnote: "Our commercial leasing advisor will contact you with the best available matches. No spam, ever.",
    waText: (a: Answers) =>
      [
        `Hi, I'm ${a.name} from ${a.company}. I'm interested in commercial office space in ${a.location}.`,
        `Down payment budget: ${a.downPayment}`,
        `Comfortable monthly payment: ${a.monthlyPayment}`,
        `Phone: ${a.phone}`,
        a.email ? `Email: ${a.email}` : null,
      ],
  },
  ar: {
    stepOf: (step: number) => `الخطوة ${step} من ${TOTAL_STEPS}`,
    q1: "أين ترغب بالشراء؟",
    q2: "ما هي ميزانية الدفعة الأولى لديك؟",
    q3: "ما هو القسط الشهري المريح لك؟",
    q4: "أوشكنا على الانتهاء — إلى أين نرسل لك أفضل الخيارات؟",
    name: "الاسم الكامل",
    company: "اسم الشركة",
    email: "البريد الإلكتروني للعمل",
    phone: "رقم الواتساب",
    phonePlaceholder: "+974 XXXX XXXX",
    back: "رجوع",
    next: "التالي",
    submit: "احصل على أفضل خياراتي",
    sending: "جارٍ الإرسال…",
    invalidPhone: "يرجى إدخال رقم واتساب صحيح.",
    genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.",
    thankYou: "كل شيء جاهز!",
    thankYouBody:
      "تم استلام طلب المطابقة الخاص بك. سيتواصل معك مستشار التأجير التجاري قريباً بالمخططات والأسعار وجدول الدفع.",
    continueWa: "المتابعة عبر واتساب",
    footnote: "سيتواصل معك مستشار التأجير التجاري بأفضل الخيارات المتاحة. بدون أي رسائل مزعجة أبداً.",
    waText: (a: Answers) =>
      [
        `مرحباً، أنا ${a.name} من ${a.company}. أنا مهتم بمساحة مكتبية تجارية في ${a.location}.`,
        `ميزانية الدفعة الأولى: ${a.downPayment}`,
        `القسط الشهري المريح: ${a.monthlyPayment}`,
        `الهاتف: ${a.phone}`,
        a.email ? `البريد الإلكتروني: ${a.email}` : null,
      ],
  },
};

function canAdvance(step: number, a: Answers) {
  if (step === 1) return a.location !== "";
  if (step === 2) return a.downPayment !== "";
  if (step === 3) return a.monthlyPayment !== "";
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
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

export default function OfficeQualifierForm({
  idPrefix,
  lang = "en",
}: {
  idPrefix: string;
  lang?: "en" | "ar";
}) {
  const t = TEXT[lang];
  const locationOptions = lang === "ar" ? LOCATION_OPTIONS_AR : LOCATION_OPTIONS;
  const downPaymentOptions = lang === "ar" ? DOWN_PAYMENT_OPTIONS_AR : DOWN_PAYMENT_OPTIONS;
  const monthlyPaymentOptions = lang === "ar" ? MONTHLY_PAYMENT_OPTIONS_AR : MONTHLY_PAYMENT_OPTIONS;
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
      event_label: "lusail_marina_office_finder_landing_page",
    });
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!PHONE_PATTERN.test(phone)) {
      setError(t.invalidPhone);
      return;
    }

    const finalAnswers: Answers = { ...answers, name, company, email, phone };
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
        interest: `${finalAnswers.location} — Down payment ${finalAnswers.downPayment}, Monthly ${finalAnswers.monthlyPayment}`,
        message: `Company: ${company}. Preferred location: ${finalAnswers.location}. Down payment budget: ${finalAnswers.downPayment}. Monthly payment budget: ${finalAnswers.monthlyPayment}.`,
        source: "lusail-marina-office-finder",
        source_reference: lang === "ar" ? "hero-qualifier-form-ar" : "hero-qualifier-form",
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
              options={locationOptions}
              value={answers.location}
              onChange={(v) => set("location", v)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q2}</h3>
          <div className="mt-4">
            <OptionGroup
              options={downPaymentOptions}
              value={answers.downPayment}
              onChange={(v) => set("downPayment", v)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q3}</h3>
          <div className="mt-4">
            <OptionGroup
              options={monthlyPaymentOptions}
              value={answers.monthlyPayment}
              onChange={(v) => set("monthlyPayment", v)}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold text-ink-900 ${headingFont}`}>{t.q4}</h3>

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
            <label htmlFor={`${idPrefix}-company`} className="mb-1.5 block text-xs font-medium text-gray-500">
              {t.company}
            </label>
            <input
              required
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              autoComplete="organization"
              defaultValue={answers.company}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-email`} className="mb-1.5 block text-xs font-medium text-gray-500">
              {t.email}
            </label>
            <input
              required
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={answers.email}
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
