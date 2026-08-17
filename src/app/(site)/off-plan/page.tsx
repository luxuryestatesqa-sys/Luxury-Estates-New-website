import type { Metadata } from "next";
import Link from "next/link";
import { getOffPlanProjects } from "@/data/offplan";
import OffPlanCard from "@/components/OffPlanCard";
import type { OffPlanStatus } from "@/data/types";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Off-Plan Projects",
  description:
    "Explore Luxury Estates' curated off-plan and under-construction developments across Doha, Lusail and The Pearl.",
  alternates: { canonical: `${SITE_URL}/off-plan` },
};

export const revalidate = 300;

const STATUSES: OffPlanStatus[] = [
  "Pre-Launch",
  "Off-Plan",
  "Under Construction",
  "Nearing Completion",
];

interface SearchParams {
  status?: string;
  area?: string;
}

export default async function OffPlanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, area } = await searchParams;

  const offPlanProjects = await getOffPlanProjects();
  const areaNames = Array.from(new Set(offPlanProjects.map((p) => p.area))).sort();

  const filtered = offPlanProjects.filter((p) => {
    if (status && p.status !== status) return false;
    if (area && p.area !== area) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="mb-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Off-Plan Projects</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
          Reserve Tomorrow&apos;s Address
        </p>
        <h1 className="mt-3 font-serif text-h1 font-semibold text-ink-900">
          Off-Plan Projects
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
          Reserve tomorrow&apos;s address today. Our off-plan portfolio spans
          pre-launch releases to near-complete developments, each vetted for
          developer track record, location and payment terms.
        </p>
      </div>

      <form
        action="/off-plan"
        method="GET"
        className="mb-12 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      >
        <div className="relative w-48">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="w-full appearance-none rounded-lg bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Stage</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
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

        <div className="relative w-48">
          <select
            name="area"
            defaultValue={area ?? ""}
            className="w-full appearance-none rounded-lg bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Area</option>
            {areaNames.map((a) => (
              <option key={a} value={a}>
                {a}
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

        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gold-600"
        >
          Apply Filters
        </button>
      </form>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <OffPlanCard key={project.id} project={project} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-24 text-center">
          <p className="font-serif text-xl font-medium text-ink-700">No projects match your search.</p>
          <p className="mt-2 text-sm text-gray-400">
            Try adjusting your filters or contact us about upcoming launches.
          </p>
        </div>
      )}
    </div>
  );
}
