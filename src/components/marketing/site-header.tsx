"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  // Only the transparency needs client JS (tied to scroll position) — kept
  // as its own small component rather than making the whole homepage a
  // client component for one scroll listener.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        scrolled
          ? "bg-background/90 sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300"
          : "bg-background sticky top-0 z-50 border-b transition-colors duration-300"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
