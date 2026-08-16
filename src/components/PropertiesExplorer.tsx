"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LayoutGrid, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import type { Property, PropertyType } from "@/data/types";
import PropertyCard from "./PropertyCard";
import PropertiesMap from "./PropertiesMap";

const PROPERTY_TYPES: PropertyType[] = [
  "Apartment",
  "Villa",
  "Penthouse",
  "Townhouse",
  "Office",
  "Land",
];

const RESIDENTIAL_TYPES: PropertyType[] = ["Apartment", "Villa", "Penthouse", "Townhouse"];
const COMMERCIAL_TYPES: PropertyType[] = ["Office", "Land"];

const HEADER_HEIGHT = 71;
const TOOLBAR_HEIGHT = 56;
const STICKY_OFFSET = HEADER_HEIGHT + TOOLBAR_HEIGHT;

type Category = "" | "residential" | "commercial";
type SortOption = "newest" | "price-asc" | "price-desc";

interface Filters {
  status: string;
  category: Category;
  type: string;
  area: string;
  city: string;
  beds: string;
  maxPrice: string;
  q: string;
}

function matchesBeds(bedsFilter: string, propertyBeds: number): boolean {
  if (!bedsFilter) return true;
  if (bedsFilter === "studio") return propertyBeds === 0;
  return propertyBeds >= Number(bedsFilter);
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
      strokeWidth={1.8}
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PropertiesExplorer({
  properties,
  areaNames,
  initialFilters,
  breadcrumb,
  heading,
}: {
  properties: Property[];
  areaNames: string[];
  initialFilters: Omit<Filters, "category">;
  breadcrumb: ReactNode;
  heading: string;
}) {
  const [filters, setFilters] = useState<Filters>({ ...initialFilters, category: "" });
  const [qDraft, setQDraft] = useState(initialFilters.q);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters((prev) => (prev.q === qDraft ? prev : { ...prev, q: qDraft }));
    }, 300);
    return () => clearTimeout(handle);
  }, [qDraft]);

  function applyQNow() {
    setFilters((prev) => (prev.q === qDraft ? prev : { ...prev, q: qDraft }));
    setShowSuggestions(false);
  }

  function selectAreaSuggestion(area: string) {
    setQDraft(area);
    setFilters((prev) => ({ ...prev, area, q: "" }));
    setShowSuggestions(false);
  }

  const locationSuggestions = useMemo(() => {
    const needle = qDraft.trim().toLowerCase();
    if (!needle) return [];
    return areaNames.filter((a) => a.toLowerCase().includes(needle)).slice(0, 8);
  }, [areaNames, qDraft]);

  const typeCounts = useMemo(() => {
    const base = properties.filter((p) => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.category === "residential" && !RESIDENTIAL_TYPES.includes(p.type)) return false;
      if (filters.category === "commercial" && !COMMERCIAL_TYPES.includes(p.type)) return false;
      if (filters.area && p.area !== filters.area) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (!matchesBeds(filters.beds, p.beds)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      return true;
    });
    const counts = new Map<PropertyType, number>();
    for (const p of base) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
    return { counts, total: base.length };
  }, [properties, filters.status, filters.category, filters.area, filters.city, filters.beds, filters.maxPrice]);

  const filtered = useMemo(() => {
    const rawQ = filters.q.trim().toLowerCase();
    const bedMatch = rawQ.match(/(\d+)\s*[- ]?\s*(bhk|beds?|bedrooms?)\b/);
    const bedsFromQuery = bedMatch ? Number(bedMatch[1]) : null;
    const STOP_WORDS = new Set(["in", "at", "for", "the", "a", "an", "near", "of", "with", "to"]);
    const textTokens = rawQ
      .replace(/(\d+)\s*[- ]?\s*(bhk|beds?|bedrooms?)\b/, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t && !STOP_WORDS.has(t));

    const result = properties.filter((p) => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.category === "residential" && !RESIDENTIAL_TYPES.includes(p.type)) return false;
      if (filters.category === "commercial" && !COMMERCIAL_TYPES.includes(p.type)) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.area && p.area !== filters.area) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (!matchesBeds(filters.beds, p.beds)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      if (bedsFromQuery !== null && p.beds !== bedsFromQuery) return false;
      if (textTokens.length) {
        const haystack = `${p.title} ${p.area} ${p.city} ${p.type} ${p.reference}`.toLowerCase();
        if (!textTokens.every((t) => haystack.includes(t))) return false;
      }
      return true;
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [properties, filters, sort]);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div
        className="sticky z-40 w-full border-b border-ink-900/8 bg-white/95 shadow-[0_1px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm"
        style={{ top: HEADER_HEIGHT }}
      >
        <div className="mx-auto max-w-[100rem] px-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-1.5 py-1.5">
            <div className="relative flex h-9 w-full max-w-[200px] items-center gap-1 rounded-full border border-ink-900/10 bg-[#f3f2ef] pl-1 pr-1.5 transition-colors duration-300 focus-within:border-ink-900/25 sm:max-w-[230px]">
              <div className="relative shrink-0">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="h-7 appearance-none rounded-full border border-ink-900/10 bg-white pl-3 pr-6 text-xs font-semibold text-ink-900 focus:outline-none"
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-none stroke-current text-gray-400"
                  strokeWidth={2}
                >
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="text"
                value={qDraft}
                onChange={(e) => setQDraft(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyQNow();
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
                placeholder="Area or city"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-1 text-xs text-ink-900 placeholder:text-gray-400 focus:outline-none"
              />

              {qDraft && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQDraft("");
                    setFilters((prev) => (prev.q === "" ? prev : { ...prev, q: "" }));
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-black/5 hover:text-ink-900"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}

              {showSuggestions && locationSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl">
                  {locationSuggestions.map((area) => (
                    <li key={area}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectAreaSuggestion(area)}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-ink-900 transition hover:bg-[#f3f2ef]"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="h-3.5 w-3.5 shrink-0 fill-none stroke-current text-gray-400"
                          strokeWidth={1.6}
                        >
                          <path
                            d="M10 18s6-5.2 6-9.6A6 6 0 0 0 4 8.4C4 12.8 10 18 10 18Z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="10" cy="8.4" r="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {area}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                aria-label="Search"
                onClick={applyQNow}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-black/5 hover:text-ink-900"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex h-9 items-center gap-0.5 rounded-full bg-[#f3f2ef] p-1">
              {(
                [
                  { value: "", label: "All" },
                  { value: "residential", label: "Residential" },
                  { value: "commercial", label: "Commercial" },
                ] as { value: Category; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => updateFilter("category", opt.value)}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                    filters.category === opt.value
                      ? "bg-ink-900 text-white"
                      : "text-gray-500 hover:text-ink-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={filters.area}
                onChange={(e) => updateFilter("area", e.target.value)}
                className="h-9 w-28 appearance-none rounded-full bg-[#f3f2ef] pl-3 pr-7 text-xs font-medium text-ink-900 transition focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              >
                <option value="">Any Location</option>
                {areaNames.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <div className="relative">
              <select
                value={filters.beds}
                onChange={(e) => updateFilter("beds", e.target.value)}
                className="h-9 w-24 appearance-none rounded-full bg-[#f3f2ef] pl-3 pr-7 text-xs font-medium text-ink-900 transition focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              >
                <option value="">Beds</option>
                <option value="studio">Studio</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+ Beds
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition ${
                  filters.maxPrice || filters.type
                    ? "bg-ink-900 text-white"
                    : "bg-[#f3f2ef] text-ink-900 hover:bg-[#e9e7e1]"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
                Filters
              </button>
              {filtersOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Property Type
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateFilter("type", "")}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                        filters.type === ""
                          ? "bg-ink-900 text-white"
                          : "bg-[#f3f2ef] text-ink-900 hover:bg-[#e9e7e1]"
                      }`}
                    >
                      All
                    </button>
                    {PROPERTY_TYPES.map((t) => {
                      const count = typeCounts.counts.get(t) ?? 0;
                      const active = filters.type === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={count === 0}
                          onClick={() => updateFilter("type", active ? "" : t)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            active ? "bg-ink-900 text-white" : "bg-[#f3f2ef] text-ink-900 hover:bg-[#e9e7e1]"
                          }`}
                        >
                          {t} <span className={active ? "text-white/60" : "text-gray-500"}>({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Max Price
                  </label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="mt-2 w-full appearance-none rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 focus:border-black/40 focus:outline-none"
                  >
                    <option value="">No max</option>
                    <option value="10000">QAR 10,000</option>
                    <option value="20000">QAR 20,000</option>
                    <option value="5000000">QAR 5,000,000</option>
                    <option value="10000000">QAR 10,000,000</option>
                    <option value="25000000">QAR 25,000,000</option>
                  </select>
                </div>
              )}
            </div>

            <div className="ml-auto flex h-9 items-center gap-0.5 rounded-full bg-[#f3f2ef] p-1">
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                  !showMap ? "bg-ink-900 text-white" : "text-gray-500 hover:text-ink-900"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.8} />
                List
              </button>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                  showMap ? "bg-ink-900 text-white" : "text-gray-500 hover:text-ink-900"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[100rem] px-5 py-8 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-10 lg:items-start ${
            showMap ? "lg:grid-cols-[1.38fr_1fr]" : "lg:grid-cols-1"
          }`}
        >
          <div>
            {breadcrumb}
            <h1 className="mt-3 font-serif text-h1 font-semibold text-ink-900">
              {heading}
            </h1>

            <div className="mt-4 flex items-center justify-between border-b border-ink-900/8 pb-4">
              <p className="text-sm">
                <span className="font-semibold text-ink-900">{filtered.length}</span>{" "}
                <span className="text-gray-500">listing{filtered.length === 1 ? "" : "s"}</span>
              </p>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none rounded-lg bg-transparent py-1 pl-2 pr-7 text-sm font-semibold text-ink-900 underline decoration-ink-900/30 decoration-1 underline-offset-4 transition hover:decoration-black focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 fill-none stroke-current text-gray-400"
                  strokeWidth={1.8}
                >
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div
                className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                  showMap ? "" : "lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    active={activeId === property.id}
                    onHover={setActiveId}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 py-24 text-center">
                <p className="font-serif text-xl font-medium text-ink-700">No properties match your search.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Try adjusting your filters or contact us for off-market options.
                </p>
              </div>
            )}
          </div>

          {showMap && (
            <div
              className="h-[420px] lg:sticky lg:h-[calc(100vh-var(--sticky-offset))]"
              style={{ top: STICKY_OFFSET, ["--sticky-offset" as string]: `${STICKY_OFFSET}px` }}
            >
              <PropertiesMap properties={filtered} activeId={activeId} onSelect={setActiveId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
