/**
 * Workspace nav icons (design handoff, designs/art/nav). 24×24 grid, 2px round
 * stroke in currentColor (plum by default) and one violet detail per icon.
 * Rendered at 20px in a fixed 20px box so every label starts at the same x.
 */
type P = { size?: number };

const VIOLET = "#5B3DF5";

function Svg({ size = 20, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="flex-none" style={{ color: "#2A1B78" }}>
      {children}
    </svg>
  );
}

const g = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

export function NavToday(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </g>
      <circle cx="12" cy="15.5" r="2" fill={VIOLET} />
    </Svg>
  );
}

export function NavCourses(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <path d="M12 7C10 5.5 7 5 3 5.5V19c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5.5C17 5 14 5.5 12 7z" />
        <path d="M12 7v13.5" />
      </g>
      <path d="M15.5 5.6v5l1.5-1.1 1.5 1.1V5.3z" fill={VIOLET} />
    </Svg>
  );
}

export function NavPractice(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <rect x="7.5" y="13.5" width="4" height="4" rx="1" />
        <path d="M14.5 9.5h2.5M14.5 15.5h2.5" />
      </g>
      <rect x="7.5" y="7.5" width="4" height="4" rx="1" fill={VIOLET} />
    </Svg>
  );
}

export function NavCards(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <path d="M8 6V5.5A2.5 2.5 0 0 1 10.5 3h8A2.5 2.5 0 0 1 21 5.5v7a2.5 2.5 0 0 1-2.5 2.5H18" />
        <rect x="3" y="8" width="15" height="13" rx="2.5" />
      </g>
      <circle cx="10.5" cy="14.5" r="1.8" fill={VIOLET} />
    </Svg>
  );
}

export function NavProgress(p: P) {
  return (
    <Svg {...p}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="13" width="4" height="7" rx="1.2" fill="none" />
        <rect x="10" y="9" width="4" height="11" rx="1.2" fill="none" />
        <rect x="16" y="5" width="4" height="15" rx="1.2" fill={VIOLET} />
      </g>
    </Svg>
  );
}

export function NavOrders(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" />
        <path d="M9 8h6M9 12h6" />
      </g>
      <rect x="9" y="15" width="4" height="2.2" rx="1.1" fill={VIOLET} />
    </Svg>
  );
}

export function NavCoach(p: P) {
  return (
    <Svg {...p}>
      <g {...g}>
        <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M10 8.7a2.1 2.1 0 1 1 2.9 1.9c-.6.3-.9.7-.9 1.4" />
      </g>
      <circle cx="12" cy="14.4" r="1.2" fill={VIOLET} />
    </Svg>
  );
}
