// Three geometric, isometric-style icons in the spirit of Linear's own
// figure illustrations — thin monoline strokes, layered/overlapping shapes
// suggesting depth, one quiet verified-green accent each — translated to
// this app's light aesthetic rather than copied at Linear's dark palette.
// A cube is the shared building block (three rhombus faces), reused with
// different arrangements per step so the set reads as one family.

import type { CSSProperties } from "react";

function Cube({
  cx,
  cy,
  size = 24,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  size?: number;
  opacity?: number;
}) {
  const hw = size / 2;
  const hh = size / 2.6;
  return (
    <g opacity={opacity}>
      <path
        d={`M ${cx} ${cy - hh} L ${cx + hw} ${cy - hh / 2.2} L ${cx} ${cy} L ${cx - hw} ${cy - hh / 2.2} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx - hw} ${cy - hh / 2.2} L ${cx} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy + hh / 2.2} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx + hw} ${cy - hh / 2.2} L ${cx} ${cy} L ${cx} ${cy + hh} L ${cx + hw} ${cy + hh / 2.2} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </g>
  );
}

type IconProps = { className?: string; style?: CSSProperties };

export function CaptureIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <Cube cx={32} cy={38} size={26} />
      {/* Three marks converging onto the cube's top face — scattered notes
          being gathered into one place. */}
      <g className="text-muted-foreground" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
        <path d="M14 12 L24 24" />
        <path d="M32 8 V20" />
        <path d="M50 12 L40 24" />
      </g>
      <circle cx="14" cy="12" r="2" className="text-verified" fill="currentColor" />
      <circle cx="32" cy="8" r="2" fill="currentColor" />
      <circle cx="50" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function BuildIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <Cube cx={32} cy={42} size={26} />
      <Cube cx={18} cy={25} size={18} opacity={0.9} />
      <Cube cx={46} cy={25} size={18} opacity={0.9} />
      <circle cx="46" cy="20" r="2" className="text-verified" fill="currentColor" />
    </svg>
  );
}

export function FindIcon({ className, style }: IconProps) {
  const bars = [-18, -9, 0, 9, 18];
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <g stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
        {bars.map((x, i) => {
          const isAccent = i === 2;
          return (
            <rect
              key={x}
              x={32 + x - 5}
              y={isAccent ? 14 : 20}
              width="10"
              height={isAccent ? 36 : 28}
              rx="4"
              fill="var(--card)"
              opacity={isAccent ? 1 : 0.65}
              className={isAccent ? "text-verified" : undefined}
              stroke={isAccent ? "currentColor" : "currentColor"}
            />
          );
        })}
      </g>
      <circle cx="32" cy="14" r="2" className="text-verified" fill="currentColor" />
    </svg>
  );
}
