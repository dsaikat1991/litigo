export function Logo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- static local SVG, no benefit from next/image's optimization pipeline
  return <img src="/logo.svg" alt="Litigo" className={className ?? "h-5 w-auto"} />;
}
