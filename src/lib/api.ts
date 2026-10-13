import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
  /** The session token is missing, expired or revoked. */
  get unauthorized() {
    return this.status === 401 || this.status === 403 || this.message === "not_signed_in";
  }
}

/** Call a Supabase RPC function. Every app read and write goes through these. */
export async function rpc<T>(fn: string, args: Record<string, unknown> = {}, init?: { signal?: AbortSignal }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      signal: init?.signal,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("offline", 0);
  }
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? text;
    } catch {
      // keep raw text
    }
    throw new ApiError(message, res.status);
  }
  return (text ? JSON.parse(text) : null) as T;
}

export function friendlyError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.message === "invalid_code") return "That code didn't work. Check it and try again.";
    if (e.message === "offline") return "You seem to be offline. Your work is saved on this device and will sync later.";
    if (e.unauthorized) return "Your session has ended. Please sign in again.";
    if (e.message === "too_many_open") return "You have 10 open coach questions. Wait for a reply before asking more.";
    if (e.message === "not_reviewer") return "Only the nurse reviewer can approve content.";
    if (e.message === "note_required") return "Add a note saying what needs to change.";
  }
  return "Something went wrong. Please try again.";
}
