// Three premium isometric wireframe illustrations — thin 1px strokes,
// orthographic projection, no color accent (strictly monochrome: depth and
// hierarchy come from opacity grading alone, the way Linear/Vercel/Figma's
// own technical-diagram illustrations shade a form without ever tinting
// it), a soft blurred ambient shadow beneath each, and generous internal
// padding so the geometry never crowds its own viewBox.
//
// A single "IsoLayer" primitive (three faces of a flat isometric slab: top,
// left, right) is the shared building block, reused at different sizes and
// stacking arrangements per illustration so the set reads as one family.

import type { CSSProperties } from "react";
import { useId } from "react";

type IconProps = { className?: string; style?: CSSProperties };

function IsoLayer({
  cx,
  cy,
  hw = 22,
  hh = 9,
  depth = 10,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  hw?: number;
  hh?: number;
  depth?: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {/* Left face */}
      <path
        d={`M ${cx - hw} ${cy} L ${cx} ${cy + hh} L ${cx} ${cy + hh + depth} L ${cx - hw} ${cy + depth} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.65"
      />
      {/* Right face */}
      <path
        d={`M ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx} ${cy + hh + depth} L ${cx + hw} ${cy + depth} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Top face */}
      <path
        d={`M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </g>
  );
}

function AmbientShadow({ id, cx, cy, rx }: { id: string; cx: number; cy: number; rx: number }) {
  return (
    <>
      <defs>
        <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx / 6} fill="currentColor" opacity="0.1" filter={`url(#${id})`} />
    </>
  );
}

// Growing Legal Memory — for "Build your litigation memory": stacked
// layers (arguments, research, judgments, lessons) accumulating over time,
// each newer layer smaller and set slightly off-centre from the one below,
// reading as organic growth rather than a rigid, uniform tower.
export function BuildIcon({ className, style }: IconProps) {
  const shadowId = useId();
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={146} rx={46} />
      <IsoLayer cx={100} cy={120} hw={32} hh={13} depth={11} opacity={0.7} />
      <IsoLayer cx={96} cy={96} hw={27} hh={11} depth={10} opacity={0.8} />
      <IsoLayer cx={102} cy={73} hw={22} hh={9} depth={9} opacity={0.9} />
      <IsoLayer cx={98} cy={52} hw={17} hh={7} depth={8} opacity={1} />
    </svg>
  );
}

// Connected Litigation Knowledge — for "Capture what matters": scattered
// case nodes (an argument here, a research note there) linked by thin
// lines that all converge into one larger layer — the memory the loose
// pieces become once captured.
export function CaptureIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const nodes = [
    { x: 34, y: 30 },
    { x: 166, y: 26 },
    { x: 24, y: 96 },
    { x: 170, y: 100 },
  ];
  const center = { x: 100, y: 66 };
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={146} rx={44} />
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        {nodes.map((n) => (
          <line key={`${n.x}-${n.y}`} x1={n.x} y1={n.y} x2={center.x} y2={center.y - 8} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <IsoLayer key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} hw={9} hh={4} depth={5} opacity={0.6 + i * 0.05} />
      ))}
      <IsoLayer cx={center.x} cy={center.y} hw={26} hh={11} depth={11} opacity={1} />
    </svg>
  );
}

// Instant Search — for "Find it when it matters most": thin, layered case
// files fanned out, all but one faded back, with the matching file pulled
// forward and fully resolved — "found" is read through contrast and
// position alone, no colour needed to mark it.
export function FindIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const offsets = [
    { dx: -34, dy: -14, opacity: 0.45 },
    { dx: -14, dy: -6, opacity: 0.6 },
    { dx: 14, dy: -6, opacity: 0.6 },
    { dx: 34, dy: -14, opacity: 0.45 },
  ];
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={144} rx={44} />
      {offsets.map((o) => (
        <IsoLayer
          key={`${o.dx}-${o.dy}`}
          cx={100 + o.dx}
          cy={92 + o.dy}
          hw={16}
          hh={7}
          depth={8}
          opacity={o.opacity}
        />
      ))}
      <IsoLayer cx={100} cy={104} hw={22} hh={9} depth={10} opacity={1} />
      {/* A quiet focus ring around the resolved file, standing in for the
          highlight a colour accent would otherwise carry. */}
      <circle
        cx="100"
        cy="104"
        r="34"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.45"
      />
    </svg>
  );
}

// Search Beyond File Names — for "Search beyond file names": a layer whose
// top face carries a few thin isometric rule-lines (the content inside),
// with a magnifying glass reaching past its edge — the search resolves
// against what's written on the layer, not just the layer itself.
export function SearchDepthIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const cx = 92;
  const cy = 116;
  const hw = 30;
  const hh = 12;
  const top = { x: cx, y: cy - hh };
  const right = { x: cx + hw, y: cy };
  const bottom = { x: cx, y: cy + hh };
  const left = { x: cx - hw, y: cy };
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });
  const ruleLines = [0.32, 0.56, 0.8].map((t) => ({
    a: lerp(left, top, t),
    b: lerp(bottom, right, t),
  }));
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={146} rx={44} />
      <IsoLayer cx={cx} cy={cy} hw={hw} hh={hh} depth={13} opacity={0.85} />
      <g stroke="currentColor" strokeWidth="1" opacity="0.4">
        {ruleLines.map((l, i) => (
          <line key={i} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} />
        ))}
      </g>
      <circle cx="140" cy="58" r="22" fill="var(--card)" stroke="currentColor" strokeWidth="1" />
      <line x1="155" y1="74" x2="174" y2="93" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Experience Compounds — for "Experience compounds": four layers climbing
// as a staircase rather than a straight tower, each step further along and
// higher than the last, with a faint rising line tying them into one trend.
export function CompoundGrowthIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const steps = [
    { cx: 40, cy: 132, opacity: 0.62 },
    { cx: 81, cy: 108, opacity: 0.76 },
    { cx: 122, cy: 82, opacity: 0.9 },
    { cx: 163, cy: 54, opacity: 1 },
  ];
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={150} rx={48} />
      <line
        x1="26"
        y1="142"
        x2="176"
        y2="42"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.4"
      />
      {steps.map((s) => (
        <IsoLayer key={s.cx} cx={s.cx} cy={s.cy} hw={17} hh={7} depth={9} opacity={s.opacity} />
      ))}
    </svg>
  );
}

// You Own Your Work — for "You own your work": a single archived layer with
// a key resolved plainly above it — the key is drawn at full opacity, the
// layer it secures held back, so ownership reads as the prominent idea.
export function OwnershipIcon({ className, style }: IconProps) {
  const shadowId = useId();
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={146} rx={42} />
      <IsoLayer cx={100} cy={118} hw={28} hh={12} depth={12} opacity={0.7} />
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <circle cx="100" cy="52" r="15" fill="var(--card)" />
        <line x1="100" y1="67" x2="100" y2="106" />
        <line x1="100" y1="97" x2="111" y2="97" />
        <line x1="100" y1="104" x2="109" y2="104" />
      </g>
    </svg>
  );
}

// Designed For Speed — for "Designed for speed": one resolved layer with
// thin motion-streaks trailing behind it, each fainter and shorter the
// further back it sits, reading as the layer arriving rather than sitting
// still.
export function SpeedIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const streaks = [
    { x1: 20, y1: 62, x2: 58, y2: 65, opacity: 0.3 },
    { x1: 16, y1: 80, x2: 62, y2: 82, opacity: 0.4 },
    { x1: 14, y1: 98, x2: 64, y2: 98, opacity: 0.5 },
    { x1: 18, y1: 116, x2: 60, y2: 114, opacity: 0.35 },
  ];
  return (
    <svg viewBox="0 0 200 168" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={110} cy={146} rx={44} />
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {streaks.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} opacity={s.opacity} />
        ))}
      </g>
      <IsoLayer cx={128} cy={90} hw={26} hh={11} depth={12} opacity={1} />
    </svg>
  );
}
