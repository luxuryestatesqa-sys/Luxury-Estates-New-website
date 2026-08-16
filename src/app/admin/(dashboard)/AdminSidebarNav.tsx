"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Landmark,
  Users,
  Newspaper,
  Inbox,
  Plug,
  Image as ImageIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/off-plan", label: "Off-Plan Projects", icon: Landmark },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/homepage", label: "Homepage", icon: ImageIcon },
  { href: "/admin/settings", label: "Integrations", icon: Plug },
];

export default function AdminSidebarNav({
  newLeadsCount,
  onNavigate,
}: {
  newLeadsCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-gold-400/15 text-gold-300"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </span>
            {item.href === "/admin/leads" && newLeadsCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1.5 text-xs font-bold text-ink-950">
                {newLeadsCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
