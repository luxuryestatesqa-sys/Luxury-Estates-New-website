"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const COMPANY_WHATSAPP = "97471157307";

export default function InquiryForm({
  heading = "Make an Enquiry",
  presetMessage,
  source = "general",
  sourceReference,
  whatsappNumber,
}: {
  heading?: string;
  presetMessage?: string;
  source?: string;
  sourceReference?: string;
  /** Digits-only WhatsApp number for the relevant agent. Falls back to the main company line. */
  whatsappNumber?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Browsers only allow window.open() without being blocked when it's a
    // direct, synchronous result of the click — opening it after the
    // `await` below (even a fast one) gets silently blocked in most
    // browsers. So open a blank tab right now, on the click itself, and
    // point it at the real WhatsApp URL once we have it. Note: passing
    // "noopener" here would make window.open() always return null (that's
    // the point of noopener — no reference back), which would silently
    // break this whole approach. Strip the opener manually instead, after
    // we already have the reference we need.
    const waTab = window.open("", "_blank");
    if (waTab) waTab.opener = null;

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("leads").insert({
        name,
        phone,
        email,
        message,
        source,
        source_reference: sourceReference ?? null,
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      setSubmitted(true);
      const target = (whatsappNumber || COMPANY_WHATSAPP).replace(/[^\d]/g, "");
      const waText = `Enquiry from ${name} (${phone}, ${email}):\n\n${message}`;
      const waUrl = `https://wa.me/${target}?text=${encodeURIComponent(waText)}`;
      if (waTab) waTab.location.href = waUrl;
      else window.open(waUrl, "_blank");
    } catch {
      waTab?.close();
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold-400/40 bg-gold-50 p-6 text-center">
        <p className="font-serif text-lg font-semibold text-ink-900">
          Thank you — we&apos;ve received your enquiry.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;ve opened WhatsApp with your message ready to send — just hit send there to
          reach your advisor directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h3 className="font-serif text-lg font-semibold text-ink-900">{heading}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Full Name</label>
          <input
            required
            name="name"
            type="text"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Phone</label>
          <input
            required
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
        <input
          required
          name="email"
          type="email"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Message</label>
        <textarea
          required
          name="message"
          rows={4}
          defaultValue={presetMessage}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-center text-xs text-gray-400">
        This opens WhatsApp with your message pre-filled to send.
      </p>
    </form>
  );
}
