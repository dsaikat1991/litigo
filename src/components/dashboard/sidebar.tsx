"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Folder,
  CalendarDays,
  Sparkles,
  UserRound,
  Settings,
  CreditCard,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/search", label: "Search", icon: Search, exact: false },
  { href: "/dashboard/cases", label: "Cases", icon: Folder, exact: false },
  { href: "/dashboard/diary", label: "Court Diary", icon: CalendarDays, exact: false },
  { href: "/dashboard/memories", label: "Memories", icon: Sparkles, exact: false },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard, exact: false },
];

const ADMIN_NAV_ITEM = {
  href: "/dashboard/admin/blog",
  label: "Blog Admin",
  icon: Newspaper,
  exact: false,
};

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside className="hidden w-56 shrink-0 border-r px-3 py-6 sm:block">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-normal transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
