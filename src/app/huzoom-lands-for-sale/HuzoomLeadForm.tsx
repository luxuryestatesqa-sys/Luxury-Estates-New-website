"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BUDGET_OPTIONS,
  HUZOOM_WHATSAPP,
  PLOT_SIZE_OPTIONS,
  buildWaLink,
  trackHuzoomEvent,
} from "./constants";

const PHONE_PATTERN = /^[+\d][\d\s-]{6,17}$/;

export default function HuzoomLeadForm({
  idPrefix,
  heading = "Get Huzoom Land Prices & Availability",
  sourceReference,
  presetPlotSize,
}: {
  idPrefix: string;
  heading?: string;
  sourceReference: string;
  presetPlotSize?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState(`https://wa.me/${HUZOOM_WHATSAPP}`);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const plotSize = String(data.get("plotSize") ?? "");
    const budget = String(data.get("budget") ?? "");

    if (!PHONE_PATTERN.test(phone)) {
      setError("Please enter a valid WhatsApp number.");
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
        message: `Preferred plot size: ${plotSize || "Not specified"}. Budget range: ${budget || "Not specified"}.`,
        source: "huzoom-lands-for-sale",
        source_reference: sourceReference,
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      trackHuzoomEvent("huzoom_form_submit", { source_reference: sourceReference });

      const waText = `Hi, I'm ${name}. I'm interested in Huzoom lands for sale.\nPreferred plot size: ${plotSize || "Not specified"}\nBudget range: ${budget || "Not specified"}`;
      const url = buildWaLink(waText);
      setWaUrl(url);
      setSubmitted(true);
      if (waTab) waTab.location.href = url;
      else window.open(url, "_blank");
    } catch {
      waTab?.close();
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold-400/40 bg-gold-50 p-6 text-center sm:p-8">
        <p className="font-serif text-xl font-semibold text-ink-900">Thank You!</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Your Huzoom inquiry has been received. Our property advisor will contact you shortly.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gold-500 hover:text-ink-950 sm:w-auto"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border-2 border-gold-300 bg-white p-6 shadow-xl shadow-black/5 sm:p-7"
    >
      <h3 className="font-serif text-xl font-semibold text-ink-900">{heading}</h3>

      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          Full Name
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
          WhatsApp Number
        </label>
        <input
          required
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+974 XXXX XXXX"
          pattern="[+\d][\d\s\-]{6,17}"
          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-plotSize`}
          className="mb-1.5 block text-xs font-medium text-gray-500"
        >
          Preferred Plot Size
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-plotSize`}
            name="plotSize"
            defaultValue={presetPlotSize ?? ""}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a plot size
            </option>
            {PLOT_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
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
          Budget Range
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-budget`}
            name="budget"
            defaultValue=""
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              Select a budget range
            </option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
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
        {submitting ? "Sending…" : "Get Price & Availability"}
      </button>
      <p className="text-center text-xs leading-relaxed text-gray-400">
        Our property advisor will contact you with the latest plot availability, prices and
        details.
      </p>
    </form>
  );
}
