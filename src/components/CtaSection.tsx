import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-3xl" />

      <Reveal className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center lg:px-8">
        <span className="h-px w-10 bg-gold-400/70" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
          Get in Touch
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
          Considering buying, selling or leasing?
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream-100/70">
          Speak with a Luxury Estates advisor for a confidential, no-obligation
          consultation on your property goals in Qatar.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-sm bg-gold-500 px-8 py-3 text-sm font-medium text-ink-950 shadow-lg shadow-gold-500/20 transition hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
          >
            Book a Consultation
          </Link>
          <Link
            href="/properties"
            className="rounded-sm border border-cream-50/30 px-8 py-3 text-sm font-medium text-cream-50 transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
          >
            Browse Properties
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
