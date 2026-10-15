import Link from "next/link";

/** Almanac approved public mark: violet square, white ring and orange accent dot. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#5B3DF5" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="22" cy="10" r="3.25" fill="#F2711C" />
    </svg>
  );
}

export function Logo({ href = "/", size = 32, textClass = "text-xl" }: { href?: string; size?: number; textClass?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 font-display font-extrabold tracking-[-.045em] text-ink ${textClass}`}>
      <LogoMark size={size} />
      <span>Almanac</span>
    </Link>
  );
}

/** Line illustration used for the Immunity module: a mast cell releasing granules. */
export function MastCellArt({ width = 104, className }: { width?: number; className?: string }) {
  return (
    <svg
      width={width}
      height={(width * 80) / 96}
      viewBox="0 0 96 80"
      fill="none"
      stroke="var(--color-violet)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="44" cy="42" r="24" fill="#f3f0ff" />
      {[
        [38, 36],
        [48, 34],
        [44, 46],
        [34, 48],
        [52, 50],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" fill="var(--color-violet)" />
      ))}
      <path d="M44 18v-6M44 12l-4-4M44 12l4-4" />
      <path d="M22 30l-5-3M17 27l-1-5M17 27l-5 1" />
      <path d="M66 30l5-3M71 27l1-5M71 27l5 1" />
      <circle cx="78" cy="52" r="3" fill="var(--color-tangerine)" stroke="none" />
      <circle cx="85" cy="43" r="2.4" fill="var(--color-tangerine)" stroke="none" />
      <circle cx="83" cy="62" r="2" fill="var(--color-tangerine)" stroke="none" />
    </svg>
  );
}

/** Decorative circle cluster for the violet tiles. */
export function TileDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" aria-hidden="true" className={className}>
      <circle cx="150" cy="110" r="100" fill="var(--color-violet-decor)" />
      <circle cx="120" cy="140" r="54" fill="none" stroke="#8e7bfa" strokeWidth="2" />
      <circle cx="138" cy="126" r="16" fill="var(--color-tangerine)" />
      <circle cx="96" cy="160" r="6" fill="var(--color-violet-300)" />
      <circle cx="160" cy="176" r="5" fill="var(--color-violet-300)" />
    </svg>
  );
}

export function ProgressBar({
  value,
  tone = "violet",
  track = "bg-track",
  height = "h-2",
}: {
  value: number;
  tone?: "violet" | "mint" | "tangerine" | "rose";
  track?: string;
  height?: string;
}) {
  const fill = {
    violet: "bg-violet",
    mint: "bg-correct",
    tangerine: "bg-tangerine",
    rose: "bg-incorrect",
  }[tone];
  return (
    <div aria-hidden="true" className={`${height} ${track} w-full overflow-hidden rounded`}>
      <div className={`h-full rounded ${fill}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
