import type { Metadata } from "next";
import Image from "next/image";
import {
  Ruler,
  MapPin,
  Home,
  Gem,
  PencilRuler,
  LayoutGrid,
  ShieldCheck,
  ArrowRight,
  Compass,
} from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import TrustBadges from "@/components/TrustBadges";
import HuzoomAnnouncementBar from "./HuzoomAnnouncementBar";
import HuzoomMobileBar from "./HuzoomMobileBar";
import HuzoomWhatsAppButton from "./HuzoomWhatsAppButton";
import HuzoomLeadForm from "./HuzoomLeadForm";
import HuzoomFaq from "./HuzoomFaq";
import Reveal from "./Reveal";
import { buildWaLink, DEFAULT_WA_MESSAGE, HUZOOM_PHONE } from "./constants";

const PAGE_URL = `${SITE_URL}/huzoom-lands-for-sale`;

export const metadata: Metadata = {
  title: "Land for Sale in Huzoom Lusail, Qatar",
  description:
    "Explore freehold land for sale in Huzoom Lusail, Qatar. View available plot sizes, indicative pricing and investment details. Request the latest availability from our property advisors.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Land for Sale in Huzoom Lusail, Qatar | Luxury Estates",
    description:
      "Explore freehold land for sale in Huzoom Lusail, Qatar. View available plot sizes, indicative pricing and investment details.",
    url: PAGE_URL,
    images: [{ url: `${SITE_URL}/images/huzoom/discover-community.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Land for Sale in Huzoom Lusail, Qatar | Luxury Estates",
    description:
      "Explore freehold land for sale in Huzoom Lusail, Qatar. View available plot sizes, indicative pricing and investment details.",
  },
};

const MORE_VIEWS = [
  {
    src: "/images/huzoom/lusail-marina.jpg",
    alt: "Lusail, Qatar waterfront district",
    caption: "Lusail, Qatar — Waterfront District",
  },
  {
    src: "/images/huzoom/plot-555sqm.jpg",
    alt: "555 SQM plot for sale in Huzoom Lusail",
    caption: "555 SQM Plot — Huzoom Lusail",
  },
  {
    src: "/images/huzoom/community-living.jpg",
    alt: "Huzoom Lusail community living",
    caption: "Huzoom Lusail — Community Living",
  },
];

const PRICING_TABLE = [
  {
    size: "400 sqm",
    type: "Standard Middle Plot (Phase 1 & 2)",
    priceRange: "QAR 1,900,000 – 2,100,000",
    rate: "~QAR 4,750 – 5,250 / sqm",
  },
  {
    size: "400 sqm",
    type: "Prime Corner / Park Attached",
    priceRange: "QAR 2,088,000 – 2,150,000",
    rate: "~QAR 5,220 – 5,375 / sqm",
  },
  {
    size: "480 sqm",
    type: "Garden Attached Plot",
    priceRange: "QAR 2,250,000 – 2,400,000",
    rate: "~QAR 4,700 – 5,000 / sqm",
  },
  {
    size: "555 sqm",
    type: "Middle / Main Street Plot",
    priceRange: "QAR 2,450,000 – 2,700,000",
    rate: "~QAR 4,400 – 4,860 / sqm",
  },
  {
    size: "555 sqm",
    type: "Prime Corner Plot (Phase 2)",
    priceRange: "QAR 2,750,000 – 2,800,000",
    rate: "~QAR 4,950 – 5,045 / sqm",
  },
  {
    size: "800 – 833 sqm",
    type: "Large Villa / Corner Lot",
    priceRange: "QAR 3,945,000 – 4,100,000",
    rate: "~QAR 4,735 – 5,125 / sqm",
  },
];

const TRUST_ITEMS: { icon: "shield" | "check" | "lock"; label: string }[] = [
  { icon: "shield", label: "Trusted Property Advisory — Luxury Estates" },
  { icon: "check", label: "100% Freehold — Lusail Ownership Zone" },
  { icon: "lock", label: "No-Obligation Enquiry, Fast Response" },
];

const WHY_CARDS = [
  {
    icon: Compass,
    title: "Prime Location",
    body: "A strategically positioned residential destination in Qatar.",
  },
  {
    icon: PencilRuler,
    title: "Build Your Own Villa",
    body: "Create a home designed around your lifestyle and requirements.",
  },
  {
    icon: LayoutGrid,
    title: "Premium Plot Options",
    body: "Choose from different plot sizes and positions based on your needs.",
  },
  {
    icon: ShieldCheck,
    title: "Long-Term Ownership",
    body: "Own a tangible residential real-estate asset.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is Huzoom?",
    a: "Huzoom is a premium residential community offering land plots for buyers looking to build their own villas in a well-planned environment.",
  },
  {
    q: "What types of land plots are available?",
    a: "A range of plot options is available, including standard villa plots, medium residential plots, premium corner or dual-street plots, and larger estate-size plots.",
  },
  {
    q: "What plot sizes are available?",
    a: "Available plot sizes start from 400 SQM and include options ranging from 480–555 SQM, 555 SQM premium plots, and 800+ SQM larger plots, subject to availability.",
  },
  {
    q: "What are the prices of Huzoom lands?",
    a: "Prices currently start from approximately QAR 1.9 million, depending on the plot size, location, position, and availability.",
  },
  {
    q: "Can I build my own villa on a Huzoom plot?",
    a: "Yes, buyers can develop a residential villa on their plot, subject to the applicable planning, building, and community regulations.",
  },
  {
    q: "Are corner and dual-street plots available?",
    a: "Yes, selected premium plots may offer corner or dual-street positions, providing additional privacy, wider access, and greater architectural flexibility.",
  },
  {
    q: "How can I check the latest plot availability?",
    a: "Simply submit the inquiry form or contact our property advisor via WhatsApp to receive the latest available plots and pricing.",
  },
  {
    q: "Are the prices shown on the website final?",
    a: "The displayed prices are indicative and may vary depending on the specific plot and current market availability. Please contact us for the latest confirmed price and availability.",
  },
  {
    q: "How can I book or reserve a plot?",
    a: "Submit your inquiry, and our property advisor will guide you through the available options, pricing, reservation process, and next steps.",
  },
];

export default function HuzoomLandsPage() {
  return (
    <div className="bg-cream-50 pb-20 lg:pb-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Huzoom Lands for Sale", url: PAGE_URL },
        ])}
      />

      <HuzoomAnnouncementBar />

      {/* HERO */}
      <section
        id="get-prices"
        className="relative isolate scroll-mt-16 overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-200/40 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              Huzoom Lusail &middot; Lusail, Qatar
            </p>
            <h1 className="mt-4 max-w-xl font-sans text-[clamp(2rem,1.5rem+2.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-ink-900">
              Land for Sale in Huzoom Lusail, Qatar
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
              Explore available residential plots in Huzoom Lusail — plot sizes, indicative
              pricing and freehold investment details for qualified buyers.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                { icon: Ruler, label: "400 – 800+ sqm plots" },
                { icon: Gem, label: "QAR 4,700 – 5,200 / sqm" },
                { icon: ShieldCheck, label: "100% Freehold" },
                { icon: Compass, label: "Dedicated Advisory" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 text-xs font-medium text-ink-800 shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-gold-600" strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={buildWaLink(DEFAULT_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                WhatsApp Us
              </a>
              <a
                href={`tel:${HUZOOM_PHONE}`}
                className="rounded-full border border-gray-300 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-900 transition hover:border-ink-900 sm:w-auto"
              >
                Call Property Advisor
              </a>
            </div>
          </div>

          {/* Photo collage — the actual land plot up front, community context as accent */}
          <div className="relative pb-8 pr-8 sm:pb-10 sm:pr-10">
            <div className="relative overflow-hidden rounded-3xl border border-gold-200 shadow-xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/huzoom/discover-community.jpg"
                  alt="Huzoom Lusail villa community at golden hour"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Caption chip — sits below the image edge, keeps the photo clear */}
            <div className="absolute -bottom-1 left-5 flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 shadow-lg sm:left-6">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-600" strokeWidth={2} />
              <p className="text-xs font-semibold text-ink-800">Huzoom Lusail — Aerial View</p>
            </div>

            {/* Floating second photo — collage accent */}
            <div className="absolute -right-2 -top-6 w-32 rotate-3 sm:-right-4 sm:-top-8 sm:w-40 lg:w-44">
              <div className="rounded-xl border-4 border-white bg-white p-1.5 shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                  <Image
                    src="/images/huzoom/lusail-marina.jpg"
                    alt="Lusail marina and skyline, Qatar"
                    fill
                    loading="lazy"
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Availability badge */}
            <div className="absolute -bottom-1 right-2 flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 shadow-lg sm:right-4">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-ink-950" />
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-950">
                Limited Availability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LAND OPTIONS & PRICES */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Inventory"
            title="Huzoom Lusail Plot Sizes & Indicative Pricing"
            subtitle="Available units typically range from 400 sqm to 800+ sqm, with average rates around QAR 4,700 – 5,200 per sqm depending on plot location."
          />

          {/* Desktop/tablet: full table. Below lg, columns don't fit without horizontal
              scroll, so a stacked card list takes over instead (see below). */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-gold-200 lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gold-200 bg-cream-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Plot Size
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Unit Type / Location
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Avg. Total Price Range (QAR)
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Avg. Rate per SQM
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TABLE.map((row) => (
                  <tr key={row.type} className="border-b border-gold-100 last:border-0">
                    <td className="px-6 py-4 font-serif font-semibold text-ink-900">{row.size}</td>
                    <td className="px-6 py-4 text-gray-600">{row.type}</td>
                    <td className="px-6 py-4 text-gray-600">{row.priceRange}</td>
                    <td className="px-6 py-4 font-medium text-gold-600">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 space-y-3 lg:hidden">
            {PRICING_TABLE.map((row) => (
              <div
                key={row.type}
                className="rounded-2xl border border-gold-200 bg-cream-50 p-5"
              >
                <p className="font-serif text-lg font-semibold text-ink-900">{row.size}</p>
                <p className="text-sm text-gray-600">{row.type}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gold-100 pt-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Price Range
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-ink-900">{row.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Rate / SQM
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gold-600">{row.rate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-gray-400">
            Indicative pricing only. Rates vary by exact plot location (middle vs. corner plot,
            main street frontage, or plots attached to parks or mosques) and current market
            conditions. Submit an enquiry for up-to-date pricing on available units.
          </p>

          <a
            href={buildWaLink(
              "Hi, I'd like up-to-date pricing on available Huzoom plots. Please share the latest rates.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.03] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] sm:inline-flex"
          >
            Enquire About Pricing
          </a>
        </Reveal>
      </section>

      {/* WHY HUZOOM + FORM */}
      <section id="huzoom-form" className="scroll-mt-24 border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading eyebrow="The Community" title="Why Choose Huzoom?" />
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {WHY_CARDS.map((c) => (
                  <WhyCard key={c.title} icon={c.icon} title={c.title} body={c.body} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <HuzoomLeadForm idPrefix="hero" sourceReference="hero" />
              <TrustBadges items={TRUST_ITEMS} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* QUICK HIGHLIGHTS */}
      <section className="border-t border-gold-200 bg-white py-10 lg:py-12">
        <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 lg:px-8">
          <Highlight icon={Ruler} title="400 SQM+" subtitle="Residential plot options" />
          <Highlight icon={MapPin} title="Premium Locations" subtitle="Prime plot positioning" />
          <Highlight
            icon={Home}
            title="Villa Development"
            subtitle="Build according to applicable regulations"
          />
          <Highlight icon={Gem} title="Limited Availability" subtitle="Request current inventory" />
        </Reveal>
      </section>

      {/* GALLERY */}
      <section className="border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Explore"
            title="Discover Huzoom"
            subtitle="A closer look at the residential setting and lifestyle Huzoom Lusail offers."
          />
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-gold-200 shadow-lg">
            <div className="relative aspect-[16/8]">
              <Image
                src="/images/huzoom/discover-community.jpg"
                alt="Huzoom Lusail residential community at dusk"
                fill
                loading="lazy"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(800, 400)}
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-4 pt-10">
                <p className="text-xs font-medium text-white">Huzoom Lusail — Residential Setting</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MORE VIEWS */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Lusail, Qatar" title="More Views of Huzoom Lusail" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {MORE_VIEWS.map((img) => (
              <div
                key={img.src}
                className="relative overflow-hidden rounded-2xl border border-gold-200 shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={shimmerBlurDataURL(300, 225)}
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-3 pt-8">
                    <p className="text-xs font-medium text-white">{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* LOCATION */}
      <section className="relative overflow-hidden border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Location" title="A Location Designed for Modern Living" />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-200">
              <Image
                src="/images/huzoom/hero-location-map.jpg"
                alt="Huzoom Lusail plot boundary map"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(400, 300)}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-base leading-relaxed text-gray-600">
                Huzoom is positioned within Qatar&apos;s residential landscape as a community for
                private villa living. It offers residential plots zoned for villa development
                within an established neighborhood setting.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Home className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  Residential plots zoned for private villa development
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  Part of an established residential community
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Compass className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  Exact road access, distances and nearby landmarks confirmed by our advisor
                </li>
              </ul>
              <a
                href={buildWaLink(
                  "Hi, could you share detailed location information for Huzoom plots?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.03] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] sm:inline-flex"
              >
                Get Location Details
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INVESTMENT */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Ownership" title="More Than Land. A Long-Term Asset." />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
            <Step number="01" title="Acquire" body="Secure your residential plot." />
            <StepArrow />
            <Step
              number="02"
              title="Develop"
              body="Build according to applicable development regulations."
            />
            <StepArrow />
            <Step
              number="03"
              title="Own"
              body="Create a property asset designed around your requirements."
            />
            <StepArrow />
            <Step
              number="04"
              title="Hold or Monetize"
              body="Explore your long-term options subject to market conditions and applicable regulations."
            />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-gold-200 bg-cream-50 px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <div className="mt-10">
            <HuzoomFaq items={FAQ_ITEMS} />
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-gold-200 bg-cream-50 py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-gold-300/20 blur-3xl"
        />
        <Reveal className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Get Started
            </p>
            <h2 className="gold-underline mt-3 pb-3 font-sans text-h2 font-bold not-italic tracking-tight text-ink-900">
              Find Your Ideal Huzoom Plot
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
              Get the latest plot availability, pricing, sizes and payment information from our
              property advisors.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#final-form"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                Get Huzoom Prices
              </a>
              <a
                href={buildWaLink(
                  "Hi, I am interested in Huzoom lands for sale. Please share the latest available plots, prices and details.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-300 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-900 transition hover:border-ink-900 sm:w-auto"
              >
                WhatsApp an Advisor
              </a>
            </div>
          </div>
          <div id="final-form" className="scroll-mt-24 space-y-4">
            <HuzoomLeadForm idPrefix="final" sourceReference="final-cta" />
            <TrustBadges items={TRUST_ITEMS} />
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-gold-200 bg-white px-5 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Luxury Estates. Promotional landing page for Huzoom
        lands for sale.
      </footer>

      <HuzoomMobileBar />
      <HuzoomWhatsAppButton />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">{eyebrow}</p>
      <h2
        className={`gold-underline mt-2 pb-3 font-serif text-h2 font-semibold ${dark ? "text-white" : "text-ink-900"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base ${dark ? "text-white/70" : "text-gray-600"}`}>{subtitle}</p>
      )}
    </div>
  );
}

function Highlight({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Ruler;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-gold-200 p-5 text-center transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-md sm:items-start sm:text-left">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-100 text-gold-600">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <p className="font-serif text-base font-semibold text-ink-900">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function WhyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Ruler;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-gold-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <p className="mt-4 font-serif text-lg font-semibold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gold-200 bg-cream-50 p-6 transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-md">
      <p className="font-serif text-3xl font-semibold text-gold-500">{number}</p>
      <p className="mt-3 font-serif text-lg font-semibold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowRight className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
    </div>
  );
}
