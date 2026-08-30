import Image from "next/image";
import Link from "next/link";
import { Star, Trophy } from "lucide-react";
import { socials } from "@/lib/socials";

const discoverLinks = [
  { href: "/off-plan", label: "New Developments" },
  { href: "/properties", label: "Exclusive Properties" },
  { href: "/properties", label: "Qatar's Areas" },
  { href: "/huzoom-lands-for-sale", label: "Huzoom Lusail — Land for Sale" },
  { href: "/qatar-apartment-finder", label: "Lease-to-Own Apartments — Lusail & The Pearl" },
  { href: "/contact", label: "Off-Market" },
  { href: "/blog", label: "Blog" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/agents", label: "Agents" },
  { href: "/careers", label: "Careers" },
  { href: "/contact?intent=list", label: "List Your Property" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { href: "/agents", label: "For Agents" },
  { href: "/contact", label: "For Investors" },
  { href: "/contact", label: "For Developers" },
  { href: "/contact", label: "For Sellers" },
  { href: "/contact", label: "For Clients" },
  { href: "/contact", label: "Financing" },
];

const linkColumns = [
  { title: "Discover", links: discoverLinks },
  { title: "Company", links: companyLinks },
  { title: "Resources", links: resourceLinks },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold-400/10 bg-[#111111] text-white">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/brand/logo.png"
                alt="Luxury Estates"
                width={144}
                height={139}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <span className="font-serif text-xl font-semibold uppercase tracking-[0.14em] text-white">
                Luxury <span className="text-gradient-gold">Estates</span>
                <sup className="ml-0.5 text-xs align-super">&reg;</sup>
              </span>
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
              Luxury Estates is a boutique real estate brokerage representing
              Qatar&apos;s finest apartments, villas and commercial addresses.
              We work with a deliberately small portfolio of clients and
              properties, spanning The Pearl, Lusail and West Bay, so every
              transaction receives the depth of attention it deserves. Our
              advisors guide buyers, tenants and investors from first
              viewing through to title transfer.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-3 rounded-lg border border-gold-400/20 bg-white/[0.03] px-4 py-3">
                <Trophy className="h-6 w-6 shrink-0 text-gold-400" strokeWidth={1.6} />
                <div className="text-eyebrow uppercase leading-tight text-white/80">
                  <p>Qatar Real Estate Awards</p>
                  <p>Best Luxury Brokerage</p>
                  <p>2025</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-white/85">Rating on Google</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-base font-semibold text-white">4.8</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="text-sm text-white/45">(340)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400/80">
                  {col.title}
                </h4>
                <ul className="mt-5 space-y-[18px]">
                  {col.links.map((link, i) => (
                    <li key={`${col.title}-${link.label}-${i}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/85 transition hover:text-gold-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:border-gold-400 hover:text-gold-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Luxury Estates W.L.L. All rights reserved.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-sm text-white/60">
            A platform by <span className="font-semibold text-white">Luxury Estates Group</span>
          </p>
          <div className="flex items-center gap-3 text-sm text-white/85">
            <Link href="/privacy" className="transition hover:text-gold-400">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="transition hover:text-gold-400">
              Terms and Conditions
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/cookies" className="transition hover:text-gold-400">
              Use of Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
