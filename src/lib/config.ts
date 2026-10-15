/**
 * Public configuration. The Supabase publishable key is safe in the browser:
 * all data access goes through security-definer functions that check a
 * student's or coach's session token.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pebkqsyfliytbowxzyun.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_IGofj6eGYi8wMVXtyKpabw_iTdtA9eH";

/** Base URL for lesson clips, posters and captions (Vercel Blob). Empty hides video. */
export const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? "";

export const REVIEWER = { name: "Emily Carter", credentials: "MSN, RN, CCRN" };

/** Pass mark shown on simulation pre-start and results (design 15a/10c). Confirm with the course lead (handoff open item 15). */
export const PASS_MARK = 75;

export const EXAMS = {
  midterm: { label: "Midterm simulation", questions: 50, minutes: 60 },
  final: { label: "Final simulation", questions: 100, minutes: 120 },
  check: { label: "Starting check", questions: 20, minutes: 20 },
} as const;
