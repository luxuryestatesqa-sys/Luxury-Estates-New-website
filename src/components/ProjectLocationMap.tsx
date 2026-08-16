"use client";

import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { formatLocation } from "@/lib/format";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  mapTypeId: "hybrid",
};

interface ProjectLocationMapProps {
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export default function ProjectLocationMap({ name, area, city, lat, lng }: ProjectLocationMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "luxury-estates-google-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const position = { lat, lng };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-ink-900/20 bg-cream-100 p-6 text-center">
        <p className="font-serif text-base font-semibold text-ink-800">
          Map view needs a Google Maps API key
        </p>
        <p className="mt-2 text-xs text-ink-500">
          Add <code className="rounded bg-ink-900/10 px-1.5 py-0.5">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to <code className="rounded bg-ink-900/10 px-1.5 py-0.5">.env.local</code> to enable it.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-center text-sm text-red-700">
        Failed to load the map. Check that the Maps JavaScript API is enabled for your key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-cream-100">
        <p className="text-sm text-ink-400">Loading map&hellip;</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gold-400/25 shadow-sm">
      <div className="h-64 w-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position}
          zoom={14}
          options={mapOptions}
        >
          <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div
              className="inline-block -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md"
              style={{ position: "relative" }}
            >
              {name}
            </div>
          </OverlayView>
        </GoogleMap>
      </div>
      <div className="bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">Location</p>
        <p className="mt-1 font-serif text-sm font-semibold text-ink-900">
          {formatLocation(area, city)}
        </p>
      </div>
    </div>
  );
}
