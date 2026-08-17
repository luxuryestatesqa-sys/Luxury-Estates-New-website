"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Open the tab now, on the click itself — doing it after the `await`
    // below gets silently blocked by most browsers' popup blockers. Note:
    // passing "noopener" here would make window.open() always return null
    // (that's the point of noopener), which would silently break this
    // whole approach — strip the opener manually instead, after we already
    // have the reference we need.
    const waTab = window.open("", "_blank");
    if (waTab) waTab.opener = null;

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const interest = String(data.get("interest") ?? "");
    const agent = searchParams.get("agent");
    const intent = searchParams.get("intent");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("leads").insert({
        name,
        phone,
        email,
        message,
        interest,
        source: intent ? `contact-${intent}` : "contact",
        source_reference: agent,
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      setSubmitted(true);
      const waText = `Enquiry from ${name} (${phone}, ${email}) — interested in ${interest}:\n\n${message}`;
      const waUrl = `https://wa.me/97471157307?text=${encodeURIComponent(waText)}`;
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
      <div className="rounded-xl border border-gold-400/40 bg-gold-50 p-8 text-center">
        <p className="font-serif text-lg font-semibold text-ink-900">
          Thank you — we&apos;ve received your message.
        </p>
        <p className="mt-2 text-sm text-[#6b7280]">
          We&apos;ve opened WhatsApp with your message ready to send — just hit send there to
          reach our team directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex-1">
      <h2 className="font-serif text-2xl font-semibold text-ink-900">Send a Message</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">
            Full Name
          </label>
          <input
            required
            name="name"
            type="text"
            className="w-full rounded-lg border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Phone</label>
          <input
            required
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Email</label>
        <input
          required
          name="email"
          type="email"
          className="w-full rounded-lg border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">
          I am interested in&hellip;
        </label>
        <div className="relative">
          <select
            required
            name="interest"
            defaultValue=""
            className="w-full appearance-none rounded-lg border border-[#e8e8e8] bg-white px-4 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="buying">Buying</option>
            <option value="selling">Selling</option>
            <option value="renting">Renting</option>
            <option value="investing">Investing</option>
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

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Message</label>
        <textarea
          required
          name="message"
          rows={6}
          className="w-full rounded-lg border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-sm text-[#6b7280]">
        <input
          required
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-[#e8e8e8] text-ink-900 focus:ring-gold-500"
        />
        I agree to the{" "}
        <Link href="/privacy" className="text-gold-600 hover:underline">
          privacy policy
        </Link>
        .
      </label>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-ink-900 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">
        This opens WhatsApp with your message pre-filled to send.
      </p>
    </form>
  );
}
