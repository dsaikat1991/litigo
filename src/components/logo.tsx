export function Logo({ className }: { className?: string }) {
  // Explicit width/height (matching the SVG's real 375:150 viewBox ratio) let
  // the browser reserve the right space before the image loads, avoiding
  // layout shift — the CSS className still controls the actual rendered
  // size, this is just the intrinsic-size hint.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static local SVG, no benefit from next/image's optimization pipeline
    <img
      src="/logo.svg"
      alt="Litigo"
      width={50}
      height={20}
      className={className ?? "h-5 w-auto"}
    />
  );
}
