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
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Landmark,
  MessageSquare,
  Mic,
  Paperclip,
  Scale,
  User,
  type LucideIcon,
} from "lucide-react";

type IconProps = { className?: string; style?: CSSProperties };

type Point = [number, number];

function normalize([x, y]: Point): Point {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

// Builds a closed polygon path where each vertex can have its own corner
// radius (0 = sharp). Used to round only a tile's outer silhouette corners
// while leaving the internal seams between its faces sharp, so adjoining
// faces still meet in a single crisp crease line.
function roundedPolygonPath(points: Point[], radii: number[]): string {
  const n = points.length;
  const segments: string[] = [];
  let started = false;
  for (let i = 0; i < n; i++) {
    const r = radii[i] ?? 0;
    const curr = points[i];
    if (r <= 0) {
      segments.push(`${started ? "L" : "M"} ${curr[0]} ${curr[1]}`);
      started = true;
      continue;
    }
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    const toPrev = normalize([prev[0] - curr[0], prev[1] - curr[1]]);
    const toNext = normalize([next[0] - curr[0], next[1] - curr[1]]);
    const pIn: Point = [curr[0] + toPrev[0] * r, curr[1] + toPrev[1] * r];
    const pOut: Point = [curr[0] + toNext[0] * r, curr[1] + toNext[1] * r];
    segments.push(`${started ? "L" : "M"} ${pIn[0]} ${pIn[1]}`);
    segments.push(`Q ${curr[0]} ${curr[1]} ${pOut[0]} ${pOut[1]}`);
    started = true;
  }
  segments.push("Z");
  return segments.join(" ");
}

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

// A rounded isometric card: three faces (top, left, right) built from
// roundedPolygonPath, rounded only at the four silhouette corners (top,
// left, right, and the extruded bottom tip) so the three internal seams —
// top-to-left, top-to-right, and the vertical crease down the middle —
// stay sharp, reading as a single rounded solid rather than three loose
// rounded panels.
function IsoTile({
  cx,
  cy,
  hw = 56,
  hh = 26,
  depth = 20,
  radius = 9,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  hw?: number;
  hh?: number;
  depth?: number;
  radius?: number;
  opacity?: number;
}) {
  const top: Point = [cx, cy - hh];
  const right: Point = [cx + hw, cy];
  const rhombusBottom: Point = [cx, cy + hh];
  const left: Point = [cx - hw, cy];
  const solidBottom: Point = [cx, cy + hh + depth];
  const leftExtruded: Point = [cx - hw, cy + depth];
  const rightExtruded: Point = [cx + hw, cy + depth];

  const topPath = roundedPolygonPath([top, right, rhombusBottom, left], [radius, radius, 0, radius]);
  const leftPath = roundedPolygonPath(
    [left, rhombusBottom, solidBottom, leftExtruded],
    [radius, 0, radius, radius],
  );
  const rightPath = roundedPolygonPath(
    [right, rhombusBottom, solidBottom, rightExtruded],
    [radius, 0, radius, radius],
  );

  return (
    <g opacity={opacity}>
      <path d={leftPath} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.75" />
      <path d={rightPath} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
      <path d={topPath} fill="var(--card)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}

// A small circular badge holding a lucide glyph, nested as its own SVG
// viewport inside the parent — reused for the satellite context icons
// (source types, search facets) orbiting the Capture and Find illustrations.
function IconBadge({ cx, cy, r = 19, glyph: Glyph }: { cx: number; cy: number; r?: number; glyph: LucideIcon }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--card)" stroke="currentColor" strokeWidth="1.75" />
      <Glyph x={cx - r * 0.5} y={cy - r * 0.5} width={r} height={r} strokeWidth={1.75} />
    </g>
  );
}

// A page with a folded top-right corner, a scale-of-justice mark, and a
// few rule lines standing in for the captured text — the one illustrated
// element shared by Capture (floating above the tile) and Find (as the
// front-most card pulled from the tray).
function Document({
  x,
  y,
  width,
  height,
  opacity = 1,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}) {
  const fold = width * 0.19;
  const r = 6;
  return (
    <g opacity={opacity}>
      <path
        d={`M ${x + r} ${y}
            L ${x + width - fold} ${y}
            L ${x + width} ${y + fold}
            L ${x + width} ${y + height - r}
            Q ${x + width} ${y + height} ${x + width - r} ${y + height}
            L ${x + r} ${y + height}
            Q ${x} ${y + height} ${x} ${y + height - r}
            L ${x} ${y + r}
            Q ${x} ${y} ${x + r} ${y} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d={`M ${x + width - fold} ${y} L ${x + width} ${y + fold} L ${x + width - fold} ${y + fold} Z`}
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <Scale
        x={x + width / 2 - width * 0.19}
        y={y + height * 0.16}
        width={width * 0.38}
        height={width * 0.38}
        strokeWidth={1.5}
        opacity={0.85}
      />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.35">
        <line x1={x + width * 0.14} y1={y + height * 0.62} x2={x + width - width * 0.14} y2={y + height * 0.62} />
        <line x1={x + width * 0.14} y1={y + height * 0.73} x2={x + width - width * 0.28} y2={y + height * 0.73} />
        <line x1={x + width * 0.14} y1={y + height * 0.84} x2={x + width - width * 0.4} y2={y + height * 0.84} />
      </g>
    </g>
  );
}

// A small flat card without the folded corner — used for the two unread
// layers behind the front Document in Find's tray, where the fold detail
// would be lost at that scale anyway.
function MiniCard({
  x,
  y,
  width,
  height,
  rotate,
  opacity = 1,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  opacity?: number;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`} opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="8"
        fill="var(--card)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  );
}

// Build your litigation memory — a stack of four rounded cards climbing
// straight up (no organic offset this time, deliberately aligned like a
// pillar), a scale-of-justice mark resolved on the top card, a solid
// bookmark tab breaking the outline-only palette as the one filled accent,
// and a small progress dot cluster near the base standing in for "still
// growing."
export function BuildIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const cx = 130;
  const tileCys = [298, 240, 182, 124];
  return (
    <svg viewBox="0 0 260 340" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={cx} cy={334} rx={62} />
      {tileCys.map((cy) => (
        <IsoTile key={cy} cx={cx} cy={cy} hw={60} hh={28} depth={21} radius={10} />
      ))}
      <Scale x={cx - 19} y={tileCys[3] - 24} width={38} height={38} strokeWidth={1.5} />
      <path
        d={`M ${cx + 44} ${tileCys[1] - 10} L ${cx + 70} ${tileCys[1] - 10} L ${cx + 70} ${tileCys[1] + 26} L ${cx + 57} ${tileCys[1] + 16} L ${cx + 44} ${tileCys[1] + 26} Z`}
        fill="currentColor"
      />
      <circle cx={cx - 42} cy={tileCys[0] - 8} r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={cx - 20} cy={tileCys[0] - 8} r="2" fill="currentColor" opacity="0.6" />
      <circle cx={cx - 10} cy={tileCys[0] - 8} r="2" fill="currentColor" opacity="0.6" />
      <circle cx={cx} cy={tileCys[0] - 8} r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

// Capture what matters — a base tile with a case document (scale mark plus
// rule lines) resting on top, fed by four source types — chat, voice note,
// image, attachment — each a satellite badge on a dashed line converging
// on the tile, the moment scattered inputs become one captured record.
export function CaptureIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const tileCx = 190;
  const tileCy = 260;
  const badges: { cx: number; cy: number; glyph: LucideIcon }[] = [
    { cx: 44, cy: 128, glyph: MessageSquare },
    { cx: 336, cy: 128, glyph: Mic },
    { cx: 36, cy: 262, glyph: ImageIcon },
    { cx: 344, cy: 262, glyph: Paperclip },
  ];
  return (
    <svg viewBox="0 0 380 330" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={tileCx} cy={296} rx={58} />
      <g stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 4" opacity="0.4">
        {badges.map((b) => (
          <line key={b.cx} x1={b.cx} y1={b.cy} x2={tileCx} y2={tileCy - 10} />
        ))}
      </g>
      {badges.map((b) => (
        <IconBadge key={b.cx} cx={b.cx} cy={b.cy} glyph={b.glyph} />
      ))}
      <IsoTile cx={tileCx} cy={tileCy} hw={54} hh={25} depth={19} radius={10} />
      <Document x={128} y={44} width={126} height={190} />
    </svg>
  );
}

// Find it when it matters most — an open tray holding the same document,
// fanned behind two unread layers, with a magnifying glass hovering above
// it, orbited by the facets a search can resolve against — date, document,
// party, court — rather than just a file name.
export function FindIcon({ className, style }: IconProps) {
  const shadowId = useId();
  const trayCx = 125;
  const trayCy = 240;
  const glassCx = 255;
  const glassCy = 90;
  const badges: { cx: number; cy: number; glyph: LucideIcon }[] = [
    { cx: 200, cy: 45, glyph: Calendar },
    { cx: 312, cy: 52, glyph: FileText },
    { cx: 193, cy: 138, glyph: User },
    { cx: 316, cy: 142, glyph: Landmark },
  ];
  return (
    <svg viewBox="0 0 340 300" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={trayCx} cy={276} rx={58} />
      <g stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4">
        {badges.map((b) => (
          <line key={b.cx} x1={b.cx} y1={b.cy} x2={glassCx} y2={glassCy} />
        ))}
      </g>
      {badges.map((b) => (
        <IconBadge key={b.cx} cx={b.cx} cy={b.cy} glyph={b.glyph} />
      ))}
      <IsoTile cx={trayCx} cy={trayCy} hw={62} hh={28} depth={22} radius={9} />
      <MiniCard x={88} y={125} width={64} height={88} rotate={-8} opacity={0.55} />
      <MiniCard x={98} y={133} width={64} height={88} rotate={-2} opacity={0.75} />
      <Document x={108} y={140} width={70} height={96} />
      <circle cx={glassCx} cy={glassCy} r="30" fill="var(--card)" stroke="currentColor" strokeWidth="2.5" />
      <line
        x1={glassCx + 21}
        y1={glassCy + 21}
        x2={glassCx + 44}
        y2={glassCy + 44}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
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

// The six-edge silhouette of an isometric box (top diamond extruded down
// by `depth`), stroke-only — no face fills — plus the two ridge lines
// from the top vertex that read as the top face's near edges. Reused at
// two scales for the cube-within-a-cube pedestal below.
function WireframeCube({
  cx,
  cy,
  hw,
  hh,
  depth,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  depth: number;
  opacity?: number;
}) {
  const top: Point = [cx, cy - hh];
  const right: Point = [cx + hw, cy];
  const rhombusBottom: Point = [cx, cy + hh];
  const left: Point = [cx - hw, cy];
  const solidBottom: Point = [cx, cy + hh + depth];
  const leftBottom: Point = [cx - hw, cy + depth];
  const rightBottom: Point = [cx + hw, cy + depth];
  return (
    <g opacity={opacity} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <path
        d={`M ${top[0]} ${top[1]} L ${right[0]} ${right[1]} L ${rightBottom[0]} ${rightBottom[1]} L ${solidBottom[0]} ${solidBottom[1]} L ${leftBottom[0]} ${leftBottom[1]} L ${left[0]} ${left[1]} Z`}
      />
      <line x1={top[0]} y1={top[1]} x2={left[0]} y2={left[1]} />
      <line x1={top[0]} y1={top[1]} x2={right[0]} y2={right[1]} />
      <line
        x1={rhombusBottom[0]}
        y1={rhombusBottom[1]}
        x2={solidBottom[0]}
        y2={solidBottom[1]}
        strokeDasharray="2 3"
        opacity="0.5"
      />
    </g>
  );
}

// A wireframe cube nested inside a larger one — the decorative base
// beneath the Litigo mark in the closing CTA. Stroke-only (no fill) is
// what makes it read as a light, glass-like pedestal rather than a solid
// block, so no colour accent or opacity fading is needed to keep it quiet.
export function PedestalIcon({ className, style }: IconProps) {
  const shadowId = useId();
  return (
    <svg viewBox="0 0 200 190" fill="none" className={className} style={style}>
      <AmbientShadow id={shadowId} cx={100} cy={182} rx={70} />
      <WireframeCube cx={100} cy={90} hw={88} hh={38} depth={54} />
      <WireframeCube cx={100} cy={66} hw={46} hh={20} depth={30} opacity={0.7} />
    </svg>
  );
}
