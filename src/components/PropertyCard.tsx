"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Property } from "@/data/types";
import { formatLocation, formatNumber, formatPrice } from "@/lib/format";

const BED_ICON = "M21 10.5V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3.5A2.5 2.5 0 0 0 5 13v5h1.2l.6-1.5h10.4l.6 1.5H19v-5a2.5 2.5 0 0 0-2-2.5ZM9 7h10v3.05a2.5 2.5 0 0 0-.5-.05H9V7ZM7 13a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v2H7v-2Z";
const BATH_ICON = "M7 3a2 2 0 0 0-2 2v5H4a1 1 0 0 0-1 1v2a5 5 0 0 0 3 4.58V19a1 1 0 1 0 2 0v-1h8v1a1 1 0 1 0 2 0v-1.42A5 5 0 0 0 21 13v-2a1 1 0 0 0-1-1H7V5h1a1 1 0 1 0 0-2H7Zm-2 9h14v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1Z";
const AREA_ICON = "M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 4h-4v2h6v-6h-2v4Z";

export default function PropertyCard({
  property,
  active = false,
  onHover,
}: {
  property: Property;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const [saved, setSaved] = useState(false);
  const agent = property.agent;
  const imageCount = property.imagesCount ?? property.images.length;

  return (
    <div
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative block overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] ring-1 ring-gold-300/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_55px_-15px_rgba(184,146,63,0.45)] hover:ring-2 hover:ring-gold-400 ${
        active ? "ring-2 ring-gold-500" : ""
      }`}
    >
      <Link
        href={`/properties/${property.slug}`}
        aria-label={property.title}
        className="absolute inset-0 z-10"
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-gray-100">
        {property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

        {property.featured && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-md border border-gold-300/60 bg-gradient-to-b from-[#faf3e2] to-[#f6eedc] px-3.5 py-2 text-sm font-medium text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            Exclusive
          </span>
        )}

        <button
          type="button"
          aria-label={saved ? "Remove from saved properties" : "Save property"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center transition hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-[22px] w-[22px] drop-shadow-md transition-colors ${
              saved ? "fill-gold-400 stroke-gold-400" : "fill-none stroke-white hover:fill-gold-400 hover:stroke-gold-400"
            }`}
            strokeWidth={1.5}
          >
            <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.6L6 21V4.5Z" strokeLinejoin="round" />
          </svg>
        </button>

        {imageCount > 1 && (
          <>
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/55 px-2.5 py-1.5 text-sm font-medium text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
              </svg>
              {imageCount}
            </span>
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {Array.from({ length: Math.min(imageCount, 5) }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="min-h-[42px] text-sm font-semibold leading-[1.4] text-ink-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {property.title}
        </h3>
        <p className="mt-1.5 text-sm font-normal leading-normal text-[#7a7a7a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] overflow-hidden">
          {formatLocation(property.area, property.city)}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {property.beds > 0 && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gray-400">
                <path d={BED_ICON} />
              </svg>
              <span className="text-sm font-medium text-ink-900">{property.beds}</span>
            </span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gray-400">
                <path d={BATH_ICON} />
              </svg>
              <span className="text-sm font-medium text-ink-900">{property.baths}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gray-400">
              <path d={AREA_ICON} />
            </svg>
            <span className="text-sm font-medium text-ink-900">
              {formatNumber(property.size)} m&sup2;
            </span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-ink-900/8 pt-3">
          <div>
            {property.price > 0 ? (
              <>
                <span className="font-public-sans text-lg font-normal text-ink-900">
                  {formatPrice(property.price, "total")}
                </span>
                {property.priceUnit === "month" && (
                  <span className="text-xs font-normal text-[#7a7a7a]">/mo</span>
                )}
              </>
            ) : (
              <span className="font-public-sans text-lg font-normal text-ink-900">Price on request</span>
            )}
          </div>

          <div className="relative z-20 flex items-center gap-1.5">
            {agent && (
              <a
                href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                aria-label="Call agent"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f3f2ef] text-ink-900 transition hover:scale-105 hover:bg-gold-500 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1-.2 1 .3 2.1.5 3.2.5.6 0 1 .4 1 1V19c0 .6-.4 1-1 1-9 0-16-7-16-16 0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.1.2 2.2.5 3.2.1.3 0 .7-.2 1L6.6 10.8Z" />
                </svg>
              </a>
            )}
            {agent && (
              <a
                href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(
                  `Hi, I'm interested in ${property.title} (Ref ${property.reference}).`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enquire on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f3f2ef] text-ink-900 transition hover:scale-105 hover:bg-gold-500 hover:text-white"
              >
                <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                  <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.66 1.03 1.05-4.54-.25-.4A9.55 9.55 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.19c-.29-.15-1.7-.84-1.96-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
