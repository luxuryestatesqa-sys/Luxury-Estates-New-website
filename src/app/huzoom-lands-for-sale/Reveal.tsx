"use client";

import { useEffect, useRef, useState } from "react";

// Lightweight scroll-reveal — no animation library. Defaults to fully visible
// (safe if JS never loads/hydrates, since this is a lead-gen page where a
// permanently-hidden final form would be catastrophic). Only elements that
// start below the fold get hidden-then-faded-in; anything already on screen
// at mount is left alone.
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setVisible(false);
    setAnimated(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    // Belt-and-suspenders: never leave content hidden indefinitely.
    const fallback = setTimeout(() => setVisible(true), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${animated ? "transition-all duration-700 ease-out" : ""} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
