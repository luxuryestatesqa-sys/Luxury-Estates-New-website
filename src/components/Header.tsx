"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { socials } from "@/lib/socials";

const navLinks = [
  { href: "/properties", label: "Buy / Rent" },
  { href: "/off-plan", label: "Off-Plan" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-[0.08em] transition hover:text-gold-500 ${
                pathname === link.href
                  ? "text-gold-500"
                  : transparent
                    ? "text-white/90 hover:text-white"
                    : "text-ink-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
