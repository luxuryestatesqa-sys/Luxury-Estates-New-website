"use client";

import type { ReactNode } from "react";

// page.tsx is a Server Component (it exports `metadata`), so its inline
// WhatsApp CTAs can't take an onClick directly — this thin client boundary
// is what lets whatsapp_click tracking attach to them.
export default function TrackedWhatsAppLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        window.gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: "huzoom_landing_page",
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
