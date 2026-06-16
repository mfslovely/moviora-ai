"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clapperboard, LayoutDashboard, MessageSquareText, Search, UserPlus } from "lucide-react";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";

const links = [
  { href: "/", label: "Discover", icon: Search },
  { href: "/assistant", label: "Assistant", icon: MessageSquareText },
  { href: "/dashboard", label: "Saved", icon: LayoutDashboard }
];

export function Navigation() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ember text-white shadow-glow">
            <Clapperboard size={22} />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-5">Moviora AI</span>
            <span className="text-xs text-white/52">Movie intelligence</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] p-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-md border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint transition hover:bg-mint/15 md:inline-flex"
            >
              {user.name}
            </Link>
          ) : (
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-md bg-ember px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
