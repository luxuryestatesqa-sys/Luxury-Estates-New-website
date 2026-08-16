import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedAreas, type AreaPick } from "@/data/properties";
import Reveal from "./Reveal";

const FEATURED_AREA_PICKS: AreaPick[] = [
  {
    label: "Pearl Qatar",
    area: "The Pearl Island",
    city: "Doha",
    image: "/images/areas/pearl-qatar.jpg",
  },
  {
    label: "Qetaifan Island",
    area: "Qetaifan Islands",
    city: "Lusail",
    image:
      "https://static.shared.propertyfinder.qa/media/images/listing/BNZD98GZYW82WKTAX5TX62FMCG/3ca06f83-9a03-4e80-bb05-776737ca4e4f/original.jpg?v=8db5d8787bab3877f2634d41c2ef2b80",
  },
  {
    label: "Lusail",
    city: "Lusail",
    image: "/images/areas/lusail.jpg",
  },
  {
    label: "Gewan Island",
    area: "Gewan Island",
    city: "Doha",
    image: "/images/areas/gewan-island.jpg",
  },
];

export default async function AreaHighlights() {
  const areas = await getFeaturedAreas(FEATURED_AREA_PICKS);
  if (areas.length === 0) return null;

  return (
    <section className="bg-ink-950 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Where We Operate
            </p>
            <h2 className="gold-underline mt-3 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
              Trending Areas
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream-100/70">
            The addresses our clients ask for most — island living, waterfront
            towers and Qatar&apos;s fastest-growing skyline.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[9.5rem]">
          {areas.map((area, i) => {
            const featured = i === 0;
            return (
              <Reveal
                key={area.label}
                delay={i * 80}
                className={featured ? "lg:col-span-2 lg:row-span-3" : "lg:col-span-1 lg:row-span-1"}
              >
                <Link
                  href={area.href}
                  className="group relative block h-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-[0_30px_70px_-15px_rgba(201,162,75,0.4)] lg:h-full"
                >
                  <Image
                    src={area.image}
                    alt={area.label}
                    fill
                    sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                    className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                  <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 font-serif text-xs text-gold-200 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="absolute right-4 top-4 flex h-11 w-11 -translate-y-2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:bg-gold-400 group-hover:text-ink-950 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="mb-3 inline-block h-px w-10 bg-gradient-to-r from-gold-300 to-gold-400/0" />
                    <h3
                      className={`font-serif font-semibold text-cream-50 ${
                        featured ? "text-3xl sm:text-4xl" : "text-2xl"
                      }`}
                    >
                      {area.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream-100/80">
                      <span className="font-semibold text-gold-300">{area.count}</span>{" "}
                      {area.count === 1 ? "home" : "homes"} available in {area.city}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
