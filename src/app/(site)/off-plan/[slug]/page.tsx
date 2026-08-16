import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOffPlanProjectBySlug, getOffPlanProjects } from "@/data/offplan";
import { formatLocation, formatNumber, formatPrice } from "@/lib/format";
import PropertyGallery from "@/components/PropertyGallery";
import InquiryForm from "@/components/InquiryForm";
import OffPlanCard from "@/components/OffPlanCard";
import TrustBadges from "@/components/TrustBadges";
import ProjectLocationMap from "@/components/ProjectLocationMap";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { OffPlanProject } from "@/data/types";

function offPlanJsonLd(project: OffPlanProject) {
  const url = `${SITE_URL}/off-plan/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.description,
    url,
    image: project.images,
    brand: { "@type": "Organization", name: project.developer || "Luxury Estates Real Estate" },
    offers:
      project.startingPrice > 0
        ? {
            "@type": "Offer",
            price: project.startingPrice,
            priceCurrency: "QAR",
            availability: "https://schema.org/PreOrder",
            url,
          }
        : undefined,
  };
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getOffPlanProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `${SITE_URL}/off-plan/${project.slug}` },
  };
}

export default async function OffPlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getOffPlanProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getOffPlanProjects();
  const related = allProjects
    .filter((p) => p.id !== project.id && p.area === project.area)
    .slice(0, 3);
  const relatedFallback = related.length
    ? related
    : allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <JsonLd data={offPlanJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Off-Plan Projects", url: `${SITE_URL}/off-plan` },
          { name: project.name, url: `${SITE_URL}/off-plan/${project.slug}` },
        ])}
      />

      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/off-plan" className="hover:text-gold-600">
          Off-Plan Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{project.name}</span>
      </nav>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            {formatLocation(project.area, project.city)} &middot; by {project.developer}
          </p>
          <h1 className="mt-2 font-serif text-h1 font-semibold text-ink-900">
            {project.name}
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-serif text-2xl font-semibold text-ink-900">
            {project.startingPrice > 0
              ? `From ${formatPrice(project.startingPrice, "total")}`
              : "Price on Request"}
          </p>
          <p className="text-xs text-gray-400">Ref {project.reference}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <PropertyGallery images={project.images} title={project.name} />

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-gray-100 py-6 sm:grid-cols-4">
            <Stat label="Status" value={project.status} />
            {project.handover && <Stat label="Handover" value={project.handover} />}
            {(project.minSize > 0 || project.maxSize > 0) && (
              <Stat
                label="Unit Sizes"
                value={`${formatNumber(project.minSize)}–${formatNumber(project.maxSize)} sqm`}
              />
            )}
            <Stat label="Developer" value={project.developer} />
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink-900">About this project</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{project.description}</p>
          </div>

          {(project.unitTypes.length > 0 || project.paymentPlan) && (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {project.unitTypes.length > 0 && (
                <div>
                  <h2 className="font-serif text-lg font-semibold text-ink-900">Unit Types</h2>
                  <ul className="mt-3 space-y-2">
                    {project.unitTypes.map((u) => (
                      <li key={u} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.paymentPlan && (
                <div>
                  <h2 className="font-serif text-lg font-semibold text-ink-900">Payment Plan</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {project.paymentPlan}
                  </p>
                </div>
              )}
            </div>
          )}

          {project.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-ink-900">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {project.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <ProjectLocationMap
            name={project.name}
            area={project.area}
            city={project.city}
            lat={project.lat}
            lng={project.lng}
          />

          {project.brochureUrl ? (
            <a
              href={project.brochureUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-center text-sm font-medium text-ink-900 shadow-sm transition hover:border-gold-500 hover:text-gold-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
              </svg>
              Download Brochure
            </a>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-cream-50 px-4 py-3.5 text-center text-sm text-gray-400">
              Brochure available soon
            </div>
          )}

          <InquiryForm
            heading="Request the brochure & payment plan"
            presetMessage={`I'm interested in ${project.name} (Ref ${project.reference}). Please send the brochure and full payment plan.`}
            source="off-plan"
            sourceReference={project.slug}
          />

          <TrustBadges
            items={[
              { icon: "shield", label: "Verified Developer Partnership" },
              { icon: "lock", label: "Escrow-Protected Payment Plan" },
              { icon: "check", label: "RERA-Compliant Off-Plan Sale" },
            ]}
          />
        </aside>
      </div>

      {relatedFallback.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">
            More off-plan projects
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFallback.map((p) => (
              <OffPlanCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-serif text-base font-semibold text-ink-900">{value}</p>
    </div>
  );
}
