"use client";

import { useEffect, useState } from "react";

function timeOfDayGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ name }: { name: string | null }) {
  // Time-of-day must reflect the viewer's own clock, not the server's, so this
  // is computed client-side after mount rather than passed down as server data.
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    // Deliberate: this is the standard hydration-safe pattern for a client-only
    // value (render a stable placeholder, then correct it post-mount) — not the
    // derived-state antipattern this rule normally guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(timeOfDayGreeting(new Date().getHours()));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-xl font-medium">
        {greeting}
        {name ? `, ${name}` : ""}.
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">What are you looking for today?</p>
    </div>
  );
}
