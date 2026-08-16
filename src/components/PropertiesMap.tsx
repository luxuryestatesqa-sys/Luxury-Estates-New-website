"use client";

import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/types";
import { formatNumber, formatPrice } from "@/lib/format";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const DOHA_CENTER = { lat: 25.3548, lng: 51.5033 };

const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  rotateControl: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f5f2ea" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4a4131" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#fdfcf9" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#8ecae6" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f0e9d8" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#d9cfa8" }] },
  ],
};

interface PropertiesMapProps {
  properties: Property[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export default function PropertiesMap({ properties, activeId, onSelect }: PropertiesMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "luxury-estates-google-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const geocoded = useMemo(
    () =>
      properties.filter(
        (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && !(p.lat === 0 && p.lng === 0),
      ),
    [properties],
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
    },
    [],
  );

  useEffect(() => {
    if (!mapRef.current || geocoded.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    geocoded.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
    mapRef.current.fitBounds(bounds, 60);
  }, [geocoded]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-sm border border-dashed border-ink-900/20 bg-cream-100 p-8 text-center">
        <p className="font-serif text-lg font-semibold text-ink-800">
          Map view needs a Google Maps API key
        </p>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          Add <code className="rounded bg-ink-900/10 px-1.5 py-0.5">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to <code className="rounded bg-ink-900/10 px-1.5 py-0.5">.env.local</code> and restart the
          dev server to enable it.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-sm border border-dashed border-red-300 bg-red-50 p-8 text-center text-sm text-red-700">
        Failed to load Google Maps. Check that your API key is valid and that the Maps JavaScript
        API is enabled for it.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-sm bg-cream-100">
        <p className="text-sm text-ink-400">Loading map&hellip;</p>
      </div>
    );
  }

  const previewId = hoveredId ?? activeId;
  const active = geocoded.find((p) => p.id === previewId) ?? null;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={DOHA_CENTER}
      zoom={12}
      onLoad={onLoad}
      onClick={() => onSelect(null)}
      options={mapOptions}
    >
      {geocoded.map((property) => {
        const isActive = property.id === activeId;
        const isPreviewed = property.id === previewId;
        return (
          <OverlayView
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(isActive ? null : property.id);
              }}
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex -translate-x-1/2 -translate-y-full items-stretch overflow-hidden whitespace-nowrap rounded-full shadow-md transition ${
                isPreviewed ? "z-10 scale-110 ring-2 ring-black" : ""
              }`}
              style={{ position: "relative" }}
            >
              <span className="bg-white px-3 py-1.5 text-xs font-semibold text-ink-900">
                From <span className="font-bold">{formatPrice(property.price, property.priceUnit)}</span>
              </span>
              <span className="flex items-center gap-1 bg-ink-900 px-2.5 py-1.5 text-xs font-semibold text-white">
                {property.beds > 0 ? (
                  <>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                      <path d="M21 10.5V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3.5A2.5 2.5 0 0 0 5 13v5h1.2l.6-1.5h10.4l.6 1.5H19v-5a2.5 2.5 0 0 0-2-2.5ZM9 7h10v3.05a2.5 2.5 0 0 0-.5-.05H9V7ZM7 13a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v2H7v-2Z" />
                    </svg>
                    {property.beds}
                  </>
                ) : (
                  `${formatNumber(property.size)} sqm`
                )}
              </span>
            </button>
          </OverlayView>
        );
      })}

      {active && (
        <OverlayView
          position={{ lat: active.lat, lng: active.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onMouseEnter={() => setHoveredId(active.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="w-64 -translate-x-1/2 -translate-y-[calc(100%+2.75rem)] rounded-xl border border-gray-100 bg-white shadow-2xl"
            style={{ position: "relative" }}
          >
            <Link href={`/properties/${active.slug}`} className="block">
              <div className="relative h-32 w-full overflow-hidden rounded-t-xl bg-gray-100">
                {active.images.length > 0 && (
                  <Image
                    src={active.images[0]}
                    alt={active.title}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                )}
                <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                  {active.type}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500">{active.area}</p>
                <p className="mt-0.5 truncate font-serif text-sm font-bold text-ink-900">
                  {active.title}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {active.beds > 0 ? `${active.beds} Beds · ` : ""}
                    {formatNumber(active.size)} sqm
                  </span>
                </div>
                <p className="mt-1 font-serif text-sm font-bold text-ink-900">
                  {formatPrice(active.price, active.priceUnit)}
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label="Close"
              className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 text-sm text-white"
            >
              &times;
            </button>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
  );
}
