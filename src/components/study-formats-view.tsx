import Link from "next/link";
import { type FormatIcon as Icon, type FormatState, type FormatStatus, STATUS_LABEL } from "@/lib/study-formats";

/** One glyph per format, drawn with currentColor so it follows the surrounding text colour. */
export function FormatIcon({ icon, size = 20 }: { icon: Icon; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (icon) {
    case "page":
      return <svg {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg>;
    case "play":
      return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" /></svg>;
    case "wave":
      return <svg {...p}><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" /></svg>;
    case "map":
      return <svg {...p}><circle cx="12" cy="6" r="2.5" /><circle cx="5.5" cy="17" r="2.5" /><circle cx="18.5" cy="17" r="2.5" /><path d="M10.6 8.1 7 14.8M13.4 8.1 17 14.8M8 17h8" /></svg>;
    case "check":
      return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></svg>;
    case "cards":
      return <svg {...p}><rect x="6" y="3.5" width="13" height="16" rx="2.5" /><path d="M4 7v11a2.5 2.5 0 0 0 2.5 2.5H15" /></svg>;
    case "timer":
      return <svg {...p}><circle cx="12" cy="13.5" r="7" /><path d="M12 10v3.5l2.5 1.5M10 3h4" /></svg>;
  }
}

const tone: Record<FormatStatus, string> = {
  available: "bg-success-tint text-success",
  in_production: "bg-time-tint text-time",
  planned: "bg-mist text-text-muted",
};

/** Status chip: always a word, never colour alone. */
export function FormatStatusChip({ status }: { status: FormatStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap ${tone[status]}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * The seven study formats for one course with their honest status.
 * `link` is used only for available formats; planned or in-production ones end without a link.
 */
export function FormatGrid({ states, link, compact = false }: { states: FormatState[]; link?: { href: string; label: string }; compact?: boolean }) {
  return (
    <ul className={`grid gap-3 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {states.map(({ format: f, status }) => (
        <li key={f.id} className="flex gap-3.5 rounded-section border border-border bg-canvas p-4 sm:flex-col sm:gap-2 sm:p-5">
          <div className="flex flex-none items-start justify-between gap-3">
            <span className={`grid h-10 w-10 flex-none place-items-center rounded-control ${status === "available" ? "bg-primary-tint text-primary-deep" : "bg-mist text-text-muted"}`}>
              <FormatIcon icon={f.icon} />
            </span>
            <span className="hidden sm:inline-flex">
              <FormatStatusChip status={status} />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-[16.5px] font-bold text-text sm:mt-1 sm:text-[17px]">
                {f.verb} <span className="font-normal text-text-muted">· {f.label}</span>
              </h3>
              <span className="sm:hidden">
                <FormatStatusChip status={status} />
              </span>
            </div>
            <p className="text-[13.5px] leading-[1.55] text-text-body">{f.description}</p>
            {status === "available" && link && (
              <Link href={link.href} className="inline-flex min-h-[44px] items-center text-[13.5px] font-bold text-violet-700 hover:underline sm:mt-auto sm:pt-1">
                {link.label} <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
