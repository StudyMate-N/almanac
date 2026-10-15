# Pathophysiology course-video recovery · 2026-10-15

## Source of truth
The earlier Vercel project `almanac` defines `NEXT_PUBLIC_MEDIA_BASE` for all its environments. This points to the original public Vercel Blob media store:

`https://svanrxmo5kfcdkbq.public.blob.vercel-storage.com/media`

The Netlify project's production build variable `NEXT_PUBLIC_MEDIA_BASE` has been restored to the **same** base URL. No video files were altered or transcoded.

## Existing assets
Eleven MP4s named `foundations-01.mp4` through `foundations-11.mp4`, with matching JPEG posters and VTT captions, were checked against the original Vercel Blob media store on October 15, 2026. All 33 objects returned HTTP 200.

The 11 clips total approximately 62 minutes 56 seconds. The original one-piece master recording has not been recovered. Sampled output clips are H.264, 640×360, 30 fps. The repository does not establish a higher-resolution version. **Do not claim these current files are HD.**

## Lesson mappings
- Start Here: foundations-02, foundations-03.
- Section 1 (foundations): foundations-01, 05, 06, 07, 08.
- Section 4: foundations-04, 09, 10, 11.
- Remaining sections: no video blocks mapped.

Mappings and time-stamped corrections are in `src/content/patho/clips.ts`, `src/content/patho/start.ts`, `src/content/patho/s1.ts`, `src/content/patho/s4.ts`.

`src/components/video-player.tsx` uses the base URL for `.mp4`, `.jpg`, and `.vtt`; `src/components/player/video-led.tsx` uses it for video-led topics. `src/lib/config.ts` reads the build variable.

## Verification and caveats
- Production Netlify deployment must be rebuilt after the environment variable change.
- Test a signed-in, approved Pathophysiology student in Start Here, Section 1, and Section 4, including chapter navigation, captions and review corrections.
- The Vercel Blob assets are **public object URLs**. The student lesson UI is gated by enrollment but raw media URLs are not themselves private. A future secure-storage migration should preserve access controls and avoid changing video quality.
- Do not merge Pathophysiology video assets into the separate private Advanced Pharmacology bucket or change existing student progress.
