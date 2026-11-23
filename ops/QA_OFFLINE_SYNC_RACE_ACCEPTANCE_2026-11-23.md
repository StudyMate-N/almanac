# Almanac QA: offline state-write race regression gate (2026-11-23)

Scope: `src/lib/store.tsx`, QA branch only. This is a test specification, **not** evidence that browser, backend, or network tests passed.

## Failure reproduced by source inspection (pre-fix)

The old `pushKey` submitted `c.state[key]` and then removed `key` from `c.dirty` on *any* successful response. If edit B occurred while request A was in flight, completion of A could acknowledge B without ever persisting B. Independently, concurrent requests could finish out of order, allowing stale A to overwrite B remotely.

## Required deterministic tests before merge

1. **Two edits, one key:** Hold first `state_put` RPC; edit A then B. Assert only one request is in flight for that key. Resolve A. Assert a second request with B occurs, and `dirty` clears only after B is acknowledged.
2. **Offline retry:** Reject A with an `offline` ApiError. Assert dirty remains; on online event, send latest state; assert dirty clears after success.
3. **Slow response plus signout:** Hold A, sign out (cache invalidated), then resolve A. Assert no dirty changes or local cache rehydration for the signed-out account; no retry using old token.
4. **Different keys:** Update notes and deck simultaneously; assert independent keys can progress while each key remains serialized.
5. **Server-authoritative reload:** After a successful latest-value write, load with remote state and assert latest plan/deck/notes survives; test FSRS card identity, review timestamps and answer queue independently.
6. **Unauthorized entitlement:** A cached profile or offline state must not authorize additional course IDs or signed download URLs; test both after Supabase returns.
7. **Response ordering:** Reject an older request after a newer edit; latest dirty value must remain for retry and must not be silently marked synced.

## Release gates

- Local typecheck/build and deterministic race tests green on the exact QA commit.
- Staging backend `ACTIVE_HEALTHY`; seven unauthorized endpoint probes return expected denials; checkout wrong-price preflight returns the expected rejection without an order.
- Signed-in same-student and cross-student access checks; approved file URLs only; offline reconciliation and cancellation/revocation verified without touching real customer data.
- No live payment activation or production merge without owner review.

Related: [issue #11](https://github.com/StudyMate-N/almanac/issues/11), [draft PR #12](https://github.com/StudyMate-N/almanac/pull/12).
