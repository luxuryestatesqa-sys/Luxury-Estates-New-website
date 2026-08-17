"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  function goTo(index: number) {
    const next = (index + images.length) % images.length;
    setActive(next);
    const strip = stripRef.current;
    const thumb = strip?.children[next] as HTMLElement | undefined;
    if (strip && thumb) {
      const targetLeft = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
      strip.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }

  const SWIPE_THRESHOLD = 40;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD) goTo(active - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goTo(active + 1);
  }

  return (
    <div>
      <div
        className="group relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-sm bg-ink-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <Image
            src={images[active]}
            alt={`${title} - photo ${active + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={shimmerBlurDataURL(800, 500)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={stripRef}
          className="mt-3 flex touch-pan-x snap-x snap-proximity gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              className={`relative aspect-[4/3] w-[calc(25%-0.5625rem)] shrink-0 snap-start overflow-hidden rounded-sm ring-2 transition ${
                active === i ? "ring-gold-500" : "ring-transparent"
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(200, 150)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
