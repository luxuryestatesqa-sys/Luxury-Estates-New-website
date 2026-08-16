import Link from "next/link";
import { getFeaturedProperties, getFillerProperties } from "@/data/properties";
import PropertyCard from "./PropertyCard";
import Reveal from "./Reveal";

const TARGET_COUNT = 8;

export default async function FeaturedProperties() {
  const featuredOnly = await getFeaturedProperties();
  let featured = featuredOnly.slice(0, TARGET_COUNT);

  if (featured.length < TARGET_COUNT) {
    const featuredIds = featured.map((p) => p.id);
    const fillers = await getFillerProperties(featuredIds, TARGET_COUNT - featured.length);
    featured = [...featured, ...fillers];
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Curated Selection
          </p>
          <h2 className="gold-underline mt-3 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            Featured Properties
          </h2>
        </div>
        <div className="sm:text-right">
          <p className="max-w-xs text-sm leading-relaxed text-ink-500">
            A hand-selected edge of the market — the listings our advisors
            would show a client first.
          </p>
          <Link
            href="/properties"
            className="mt-3 inline-block text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-600"
          >
            View all listings &rarr;
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((property, i) => (
          <Reveal key={property.id} delay={i * 80}>
            <PropertyCard property={property} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
