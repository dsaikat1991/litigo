"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TimezoneField({ defaultValue }: { defaultValue: string }) {
  const [timezone, setTimezone] = useState(defaultValue);

  useEffect(() => {
    // Browser-only API — detect the viewer's real timezone post-mount rather
    // than guessing server-side, same hydration-safe pattern as Greeting.
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (detected) setTimezone(detected);
    } catch {
      // Intl unsupported — keep the passed-in default.
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="timezone">Timezone</Label>
      <Input
        id="timezone"
        name="timezone"
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />
    </div>
  );
}
