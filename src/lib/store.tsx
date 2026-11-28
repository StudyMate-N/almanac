"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, rpc } from "@/lib/api";
import type { StoredDeck } from "@/lib/deck";
import { contentHash } from "@/lib/hash";
import type { Plan } from "@/lib/plan";
import type { Answer } from "@/lib/progress";

/**
 * The signed-in student's data: profile, plan, card states, flags, notes,
 * lessons watched and every answer. Kept on this device and synced to
 * Supabase, so it follows the student across devices and survives offline.
 */

export type Profile = { id: string; label: string; name: string | null; email: string | null };

export type StudentState = {
  /** Legacy single-course plan; read through planFor(). */
  plan: Plan | null;
  /** Plan per course id. */
  plans: Record<string, Plan>;
  deck: StoredDeck | null;
  flags: Record<string, true>;
  notes: Record<string, string>;
  lessons: Record<string, { at: string }>;
  ratings: Record<string, 1 | -1>;
};

const EMPTY: StudentState = { plan: null, plans: {}, deck: null, flags: {}, notes: {}, lessons: {}, ratings: {} };
const KEYS = Object.keys(EMPTY) as (keyof StudentState)[];

const TOKEN_KEY = "almanac.token";
const CACHE_KEY = "almanac.cache.v2";
const APPROVALS_KEY = "almanac.approvals";
export const COACH_KEY = "almanac.coach";

type Cache = { profileId: string; state: StudentState; dirty: (keyof StudentState)[]; pending: Answer[]; answers: Answer[] };

type Ctx = {
  status: "loading" | "signed-out" | "ready";
  token: string | null;
  profile: Profile | null;
  state: StudentState;
  answers: Answer[];
  approvals: Record<string, string>;
  approvalsLoaded: boolean;
  authorizedCourses: string[];
  /** A coach or reviewer is signed in on this device: show items awaiting review. */
  preview: boolean;
  offline: boolean;
  isVisible: (id: string, item: unknown) => boolean;
  isApproved: (id: string, item: unknown) => boolean;
  signIn: (code: string, name?: string, email?: string) => Promise<void>;
  signOut: () => Promise<void>;
  update: <K extends keyof StudentState>(key: K, value: StudentState[K]) => void;
  addAnswers: (rows: Answer[]) => void;
  saveProfile: (name: string, email: string) => Promise<void>;
};

const StudentContext = createContext<Ctx | null>(null);

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode): the app still works in memory.
  }
}

const hashCache = new WeakMap<object, string>();
function hashOf(item: unknown) {
  if (item && typeof item === "object") {
    let h = hashCache.get(item);
    if (!h) {
      h = contentHash(item);
      hashCache.set(item, h);
    }
    return h;
  }
  return contentHash(item);
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Ctx["status"]>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, setState] = useState<StudentState>(EMPTY);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [approvals, setApprovals] = useState<Record<string, string>>({});
  const [approvalsLoaded, setApprovalsLoaded] = useState(false);
  const [authorizedCourses, setAuthorizedCourses] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [offline, setOffline] = useState(false);
  const cache = useRef<Cache | null>(null);
  const activeToken = useRef<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // Only one write per key at a time: a slow earlier response must not
  // acknowledge (or overwrite after) a newer offline/local edit.
  const writesInFlight = useRef(new WeakMap<Cache, Set<keyof StudentState>>());

  const persist = useCallback(() => {
    if (cache.current) write(CACHE_KEY, cache.current);
  }, []);

  // One drain per cache instance. A late response from an old account
  // must never acknowledge or persist the current account's queue.
  const answerDrains = useRef(new WeakSet<Cache>());
  const flushAnswers = useCallback(async (tok: string) => {
    const c = cache.current;
    if (!c || answerDrains.current.has(c) || activeToken.current !== tok) return;
    answerDrains.current.add(c);
    try {
      while (cache.current === c && activeToken.current === tok && c.pending.length) {
        const batch = c.pending.slice(0, 200);
        await rpc("answers_add", {
          p_token: tok,
          p_rows: batch.map((a) => ({
            question_id: a.questionId,
            module_id: a.moduleId,
            lesson_id: a.lessonId,
            selected: a.selected,
            correct: a.correct,
            seconds: Math.round(a.seconds),
            mode: a.mode,
            session_id: a.sessionId,
            answered_at: a.at,
          })),
        });
        if (cache.current !== c || activeToken.current !== tok) return;
        c.pending = c.pending.slice(batch.length);
        persist();
        setOffline(false);
      }
    } catch (e) {
      if (cache.current === c && activeToken.current === tok &&
          e instanceof ApiError && e.message === "offline") setOffline(true);
    } finally {
      answerDrains.current.delete(c);
    }
  }, [persist]);

  const pushKey = useCallback(async (tok: string, key: keyof StudentState) => {
    const c = cache.current;
    if (!c || activeToken.current !== tok) return;
    let keys = writesInFlight.current.get(c);
    if (!keys) { keys = new Set(); writesInFlight.current.set(c, keys); }
    if (keys.has(key)) return;
    keys.add(key);
    try {
      // Serialize writes and re-send the latest value if an edit arrived
      // while a previous request was pending.
      while (cache.current === c && activeToken.current === tok) {
        if (!c.dirty.includes(key)) return;
        const value = c.state[key] ?? null;
        try {
          await rpc("state_put", { p_token: tok, p_key: key, p_value: value });
        } catch (e) {
          if (cache.current === c && activeToken.current === tok && e instanceof ApiError && e.message === "offline") setOffline(true);
          return; // Leave the dirty key for the next reconnect/retry.
        }
        // A sign-out or account switch invalidates the pending response.
        if (cache.current !== c || activeToken.current !== tok) return;
        if (c.state[key] !== value) continue;
        c.dirty = c.dirty.filter((k) => k !== key);
        persist();
        setOffline(false);
        return;
      }
    } finally {
      keys.delete(key);
    }
  }, [persist]);

  const load = useCallback(async (tok: string) => {
    try {
      const [me, remote, list, entitlements] = await Promise.all([
        rpc<Profile>("pilot_me", { p_token: tok }),
        rpc<Record<string, { value: unknown }>>("state_get", { p_token: tok }),
        rpc<Answer[]>("answers_list", { p_token: tok }),
        rpc<string[]>("learning_authorized_courses", { p_token: tok }),
      ]);
      if (activeToken.current !== tok) return;
      const local = read<Cache>(CACHE_KEY);
      const sameStudent = local?.profileId === me.id;
      const merged: StudentState = { ...EMPTY };
      for (const k of KEYS) {
        const useLocal = sameStudent && local!.dirty.includes(k);
        const v = useLocal ? local!.state[k] : (remote[k]?.value as StudentState[typeof k] | undefined);
        (merged as Record<string, unknown>)[k] = v ?? EMPTY[k];
      }
      const pending = sameStudent ? local!.pending : [];
      cache.current = { profileId: me.id, state: merged, dirty: sameStudent ? local!.dirty : [], pending, answers: list };
      persist();
      setProfile(me);
      setAuthorizedCourses(Array.isArray(entitlements) ? entitlements : []);
      setState(merged);
      setAnswers([...list, ...pending]);
      setStatus("ready");
      setOffline(false);
      for (const k of cache.current.dirty) void pushKey(tok, k);
      void flushAnswers(tok);
    } catch (e) {
      if (activeToken.current !== tok) return;
      if (e instanceof ApiError && e.unauthorized) {
        write(TOKEN_KEY, null);
        activeToken.current = null;
    setToken(null);
        setAuthorizedCourses([]);
        setStatus("signed-out");
        return;
      }
      // Offline: work from the cached copy if there is one.
      const local = read<Cache>(CACHE_KEY);
      const prof = read<Profile>("almanac.profile");
      if (local && prof && local.profileId === prof.id) {
        cache.current = local;
        setProfile(prof);
        setState(local.state);
        setAnswers([...local.answers, ...local.pending]);
        setStatus("ready");
        setOffline(true);
      } else {
        setStatus("signed-out");
      }
    }
  }, [flushAnswers, persist, pushKey]);

  useEffect(() => {
    const tok = read<string>(TOKEN_KEY);
    setPreview(Boolean(read(COACH_KEY)));
    // Seamless return visits: show what this device already knows at once, then sync quietly.
    const cachedApprovals = read<Record<string, string>>(APPROVALS_KEY);
    if (cachedApprovals) {
      setApprovals(cachedApprovals);
      setApprovalsLoaded(true);
    }
    rpc<Record<string, string>>("approved_items")
      .then((a) => {
        setApprovals(a ?? {});
        write(APPROVALS_KEY, a ?? {});
      })
      .catch(() => {
        if (!cachedApprovals) setApprovals({});
      })
      .finally(() => setApprovalsLoaded(true));
    if (tok) {
      activeToken.current = tok;
      setToken(tok);
      const local = read<Cache>(CACHE_KEY);
      const prof = read<Profile>("almanac.profile");
      if (local && prof && local.profileId === prof.id) {
        cache.current = local;
        setProfile(prof);
        setState(local.state);
        setAnswers([...local.answers, ...local.pending]);
        setStatus("ready");
      }
      void load(tok);
    } else {
      setStatus("signed-out");
    }
  }, [load]);

  useEffect(() => {
    if (profile) write("almanac.profile", profile);
  }, [profile]);

  // Retry sync when the connection comes back.
  useEffect(() => {
    const onOnline = () => {
      if (!token || !cache.current) return;
      for (const k of cache.current.dirty) void pushKey(token, k);
      void flushAnswers(token);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [token, pushKey, flushAnswers]);

  const signIn = useCallback(async (code: string, name?: string, email?: string) => {
    const res = await rpc<{ token: string; student: Profile }>("pilot_sign_in", { p_code: code, p_name: name ?? null, p_email: email ?? null });
    write(TOKEN_KEY, res.token);
    activeToken.current = res.token;
    cache.current = null;
    setToken(res.token);
    setStatus("loading");
    await load(res.token);
  }, [load]);

  const signOut = useCallback(async () => {
    const tok = token;
    write(TOKEN_KEY, null);
    write(CACHE_KEY, null);
    write("almanac.profile", null);
    write(APPROVALS_KEY, null);
    cache.current = null;
    activeToken.current = null;
    setToken(null);
    setProfile(null);
    setAuthorizedCourses([]);
    setState(EMPTY);
    setAnswers([]);
    setStatus("signed-out");
    if (tok) await rpc("pilot_sign_out", { p_token: tok }).catch(() => undefined);
  }, [token]);

  const update = useCallback(<K extends keyof StudentState>(key: K, value: StudentState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    const c = cache.current;
    if (!c || !token) return;
    c.state = { ...c.state, [key]: value };
    if (!c.dirty.includes(key)) c.dirty.push(key);
    persist();
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => { if (cache.current === c && activeToken.current === token) void pushKey(token, key); }, 700);
  }, [persist, pushKey, token]);

  const addAnswers = useCallback((rows: Answer[]) => {
    if (!rows.length) return;
    setAnswers((a) => [...a, ...rows]);
    const c = cache.current;
    if (!c || !token) return;
    c.pending = [...c.pending, ...rows];
    persist();
    void flushAnswers(token);
  }, [flushAnswers, persist, token]);

  const saveProfile = useCallback(async (name: string, email: string) => {
    if (!token) return;
    const p = await rpc<Profile>("pilot_update_profile", { p_token: token, p_name: name, p_email: email });
    setProfile(p);
  }, [token]);

  const isApproved = useCallback((id: string, item: unknown) => approvals[id] === hashOf(item), [approvals]);
  const isVisible = useCallback((id: string, item: unknown) => preview || approvals[id] === hashOf(item), [approvals, preview]);

  const value = useMemo<Ctx>(
    () => ({ status, token, profile, state, answers, approvals, approvalsLoaded, authorizedCourses, preview, offline, isVisible, isApproved, signIn, signOut, update, addAnswers, saveProfile }),
    [status, token, profile, state, answers, approvals, approvalsLoaded, authorizedCourses, preview, offline, isVisible, isApproved, signIn, signOut, update, addAnswers, saveProfile],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent(): Ctx {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside StudentProvider");
  return ctx;
}

export function firstName(p: Profile | null) {
  return p?.name?.trim().split(/\s+/)[0] || null;
}

export function initials(p: Profile | null) {
  const n = p?.name?.trim();
  if (!n) return p?.label?.replace(/\D/g, "").slice(-2) || "··";
  const parts = n.split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
