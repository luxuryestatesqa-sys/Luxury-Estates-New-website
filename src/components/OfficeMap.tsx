"use client";

import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Lusail Marina district centroid — the office address (Marina 25) doesn't
// have a verified precise geocode on file, so this centers the map on the
// right district rather than guessing exact building coordinates.
const OFFICE_POSITION = { lat: 25.4213, lng: 51.5038 };

const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
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

export default function OfficeMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "luxury-estates-google-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!GOOGLE_MAPS_API_KEY || loadError) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[#e8e8e8] bg-[#f3f3f3]">
        <span className="text-xs text-[#6b7280]">Marina 25, Lusail</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[#e8e8e8] bg-[#f3f3f3]">
        <span className="text-xs text-[#6b7280]">Loading map&hellip;</span>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold-400/25">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={OFFICE_POSITION}
        zoom={14}
        options={mapOptions}
      >
        <OverlayView position={OFFICE_POSITION} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div
            className="flex -translate-x-1/2 -translate-y-full flex-col items-center"
            style={{ position: "relative" }}
          >
            <span className="whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              Luxury Estates
            </span>
            <span className="-mt-1 h-3 w-3 rotate-45 bg-ink-900" />
          </div>
        </OverlayView>
      </GoogleMap>
    </div>
  );
}
