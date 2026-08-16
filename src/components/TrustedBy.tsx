const partners = [
  "Lusail Development Group",
  "Bahriya Coastal Developments",
  "Doha Prime Developments",
  "Fox Hills Real Estate Co.",
  "Qatari Diar",
  "United Development Company",
  "Barwa Real Estate",
  "Ezdan Holding Group",
];

// Doubled for a seamless looping marquee.
const marqueeItems = [...partners, ...partners];

export default function TrustedBy() {
  return (
    <section className="relative bg-cream-100 py-14 shadow-[0_0_40px_-15px_rgba(201,162,75,0.35)]">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />
      <span className="absolute inset-x-8 top-1 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent sm:inset-x-24" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />
      <span className="absolute inset-x-8 bottom-1 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent sm:inset-x-24" />

      <div className="flex flex-col items-center">
        <span className="h-px w-10 bg-gold-400/70" />
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">
          Trusted by Leading Developers &amp; Partners
        </p>
      </div>

      <div className="group relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream-100 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream-100 to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-8 group-hover:[animation-play-state:paused]">
          {marqueeItems.map((name, i) => (
            <div key={`${name}-${i}`} className="flex shrink-0 items-center gap-8">
              <span className="whitespace-nowrap font-serif text-lg font-medium text-ink-600 transition-colors duration-300 hover:text-gold-600">
                {name}
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400/50" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
