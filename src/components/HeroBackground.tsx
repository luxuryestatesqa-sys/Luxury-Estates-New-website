"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroBackground({
  mediaType,
  imageUrl,
  videoUrl,
}: {
  mediaType: "image" | "video";
  imageUrl: string;
  videoUrl: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  if (mediaType === "video" && videoUrl) {
    return (
      <>
        <video
          ref={videoRef}
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} />
        </video>
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (!el) return;
            el.muted = !el.muted;
            setMuted(el.muted);
          }}
          aria-label={muted ? "Unmute background video" : "Mute background video"}
          className="absolute bottom-8 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/50 lg:right-8"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <Volume2 className="h-4 w-4" strokeWidth={1.8} />
          )}
        </button>
      </>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt="Luxury waterfront villa at dusk"
      fill
      priority
      className="animate-hero-zoom object-cover"
    />
  );
}
