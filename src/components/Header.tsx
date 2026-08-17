"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { socials } from "@/lib/socials";

const PROPERTY_TYPES = ["Apartment", "Villa", "Penthouse", "Townhouse", "Office", "Land"];

const navLinks = [
  { href: "/properties?status=buy", label: "Buy", status: "buy" as const },
  { href: "/properties?status=rent", label: "Rent", status: "rent" as const },
  { href: "/off-plan", label: "Off-Plan" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function statusLinkClass(active: boolean, transparent: boolean) {
  return `flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.08em] transition hover:text-gold-500 ${
    active ? "text-gold-500" : transparent ? "text-white/90 hover:text-white" : "text-ink-700"
  }`;
}

function StatusDropdown({ status, label, href }: { status: "buy" | "rent"; label: string; href: string }) {
  return (
    <div className="absolute left-1/2 top-full w-48 -translate-x-1/2 pt-3">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
        {PROPERTY_TYPES.map((type) => (
          <Link
            key={type}
            href={`/properties?status=${status}&type=${type}`}
            className="block px-4 py-2 text-sm text-ink-700 hover:bg-gray-50 hover:text-gold-600"
          >
            {type}
          </Link>
        ))}
        <Link
          href={href}
          className="mt-1 block border-t border-gray-100 px-4 py-2 text-sm font-semibold text-ink-900 hover:text-gold-600"
        >
          All {label} Properties
        </Link>
      </div>
    </div>
  );
}

/**
 * Highlights whichever of Buy/Rent matches the current ?status= — tracked
 * without useSearchParams(), which forces this part of the header onto a
 * separate dynamic render path (Suspense + a runtime API) under this
 * Next.js version's Cache Components model. That split let the static
 * shell freeze the *other* nav links with stale build-time styling while
 * this piece re-rendered fresh per request, so the two visibly diverged
 * (white vs dark) on production despite matching perfectly in dev.
 * `activeStatus` is set optimistically on click and re-synced from the
 * real URL on mount/navigation instead, keeping the whole nav on one
 * consistent render path.
 */
function StatusNavItem({
  link,
  transparent,
  isActive,
  onNavigate,
}: {
  link: { href: string; label: string; status: "buy" | "rent" };
  transparent: boolean;
  isActive: boolean;
  onNavigate: (status: "buy" | "rent") => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={link.href}
        onClick={() => onNavigate(link.status)}
        className={statusLinkClass(isActive, transparent)}
      >
        {link.label}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
      </Link>
      {hovered && <StatusDropdown status={link.status} label={link.label} href={link.href} />}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStatus, setActiveStatus] = useState<"buy" | "rent" | null>(null);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const syncActiveStatus = () => {
      if (pathname !== "/properties") {
        setActiveStatus(null);
        return;
      }
      setActiveStatus(new URLSearchParams(window.location.search).get("status") === "rent" ? "rent" : "buy");
    };
    syncActiveStatus();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        transparent
          ? "border-white/25 bg-transparent"
          : "border-gray-100 bg-white/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="flex items-center justify-self-start gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/images/brand/logo.png"
            alt="Luxury Estates"
            width={144}
            height={139}
            priority
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span
            className={`font-serif text-xl font-semibold tracking-wide ${
              transparent ? "text-white" : "text-ink-900"
            }`}
          >
            Luxury{" "}
            <span className={transparent ? "text-white" : "text-gradient-gold"}>Estates</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-self-center gap-7 lg:flex">
          {navLinks.map((link) =>
            link.status ? (
              <StatusNavItem
                key={link.label}
                link={{ ...link, status: link.status }}
                transparent={transparent}
                isActive={activeStatus === link.status}
                onNavigate={setActiveStatus}
              />
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-[0.08em] transition hover:text-gold-500 ${
                  pathname === link.href.split("?")[0]
                    ? "text-gold-500"
                    : transparent
                      ? "text-white/90 hover:text-white"
                      : "text-ink-700"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center justify-self-end gap-4">
          <div className="hidden items-center gap-3 lg:flex">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`transition ${
                  transparent ? "text-white/80 hover:text-white" : "text-ink-600 hover:text-gold-500"
                }`}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className={`h-6 w-6 ${transparent ? "text-white" : "text-ink-900"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${transparent ? "text-white" : "text-ink-900"}`} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-wide text-ink-800 hover:text-gold-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
