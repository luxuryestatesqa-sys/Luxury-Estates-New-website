import { ChevronDown, Search } from "lucide-react";
import { getHeroSettings } from "@/data/hero";
import HeroBackground from "./HeroBackground";

const CATEGORY_LINKS = [
  { label: "Buy", href: "/properties?status=buy" },
  { label: "Rent", href: "/properties?status=rent" },
  { label: "Off-Plan", href: "/off-plan" },
];

export default async function Hero() {
  const hero = await getHeroSettings();

  return (
    <section className="relative -mt-[71px] flex min-h-[560px] items-center overflow-hidden bg-ink-950 py-28 sm:py-32">
      <HeroBackground mediaType={hero.mediaType} imageUrl={hero.imageUrl} videoUrl={hero.videoUrl} />

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-gold-900/30 to-ink-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(35,23,10,0.55)_100%)]" />

      <div className="relative z-10 mx-auto w-full px-5 text-center lg:px-8">
        <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-4">
          <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-gold-400/80 sm:block sm:w-12" />
          <p className="whitespace-nowrap text-eyebrow font-medium uppercase tracking-[0.15em] text-gold-400 sm:tracking-[0.4em]">
            Doha · Lusail · The Pearl
          </p>
          <span className="hidden h-px w-8 bg-gradient-to-l from-transparent to-gold-400/80 sm:block sm:w-12" />
        </div>

        <h1
          className="animate-fade-up mx-auto mt-4 max-w-xl text-balance font-serif font-semibold italic leading-[1.12] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
          style={{ fontSize: "clamp(32px, 4.4vw, 54px)", animationDelay: "70ms" }}
        >
          Find Your Perfect Home
        </h1>

        <p
          className="animate-fade-up mx-auto mt-3 max-w-md text-sm font-normal tracking-wide text-white/80 sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          Premium properties in Qatar,{" "}
          <span className="font-normal italic text-gold-400">selected for you.</span>
        </p>

        <form
          action="/properties"
          method="GET"
          className="animate-fade-up mx-auto mt-8 flex h-12 w-full max-w-2xl items-center rounded-full bg-white px-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)] ring-1 ring-black/10 transition focus-within:ring-2 focus-within:ring-ink-900/30 sm:h-14 sm:px-2"
          style={{ animationDelay: "170ms" }}
        >
          <div className="relative ml-1 shrink-0 sm:ml-1.5">
            <select
              name="status"
              defaultValue="rent"
              className="h-9 cursor-pointer appearance-none rounded-full bg-cream-100 py-0 pl-3 pr-6 text-xs font-semibold text-ink-900 shadow-sm ring-1 ring-inset ring-cream-200 transition hover:bg-cream-200 focus:outline-none sm:h-10 sm:pl-4 sm:pr-7 sm:text-sm"
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 z-10 h-3 w-3 -translate-y-1/2 text-ink-500 sm:right-3"
              strokeWidth={1.8}
            />
          </div>

          <span className="mx-1 hidden h-6 w-px shrink-0 bg-ink-900/10 sm:block" />

          <input
            type="text"
            name="q"
            placeholder="Search by property, area or city"
            className="min-w-0 flex-1 bg-transparent px-2.5 text-xs text-ink-900 placeholder:text-gray-400 focus:outline-none sm:px-3 sm:text-sm"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex shrink-0 items-center rounded-full bg-ink-900 p-2.5 text-white transition hover:bg-gold-500 hover:text-ink-950 sm:p-3"
          >
            <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
          </button>
        </form>

        <div
          className="animate-fade-up mx-auto mt-6 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-white/70 sm:text-sm"
          style={{ animationDelay: "220ms" }}
        >
          {CATEGORY_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              {i > 0 && <span className="h-3 w-px bg-white/25" aria-hidden="true" />}
              <a href={link.href} className="group relative py-1 transition hover:text-gold-300">
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-gold-300 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex">
        <span className="flex h-9 w-9 animate-bounce items-center justify-center rounded-full border border-white/25 text-white/60">
          <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
    </section>
  );
}
