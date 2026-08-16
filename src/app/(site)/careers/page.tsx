import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Luxury Estates advisory team representing Qatar's finest properties.",
  alternates: { canonical: `${SITE_URL}/careers` },
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-[100rem] px-5 py-10 lg:px-8">
      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/agents" className="hover:text-gold-600">
          Agents
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Careers</span>
      </nav>

      <div className="mt-4 flex items-center gap-6 border-b border-[#e8e8e8] pb-3">
        <Link
          href="/agents"
          className="pb-3 text-sm font-medium text-[#6b7280] transition hover:text-[#111]"
        >
          Find an Agent
        </Link>
        <span className="border-b-2 border-[#111] pb-3 -mb-3 text-sm font-medium text-[#111]">
          Join Our Team
        </span>
      </div>

      <h1 className="mt-6 max-w-2xl font-serif text-h1 font-semibold text-ink-900">
        Build your career in Qatar&apos;s luxury property market.
      </h1>
      <p className="mt-3 max-w-xl text-lg text-[#6b7280]">
        We back our advisors with a curated portfolio, a trusted brand and a
        deliberately small client roster — so every deal gets the attention
        it deserves. Reach out and tell us about yourself.
      </p>

      <Link
        href="/contact"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-ink-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
      >
        Get in Touch
      </Link>
    </div>
  );
}
