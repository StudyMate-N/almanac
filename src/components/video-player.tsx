"use client";

import { forwardRef } from "react";
import { MEDIA_BASE } from "@/lib/config";

type Props = { video?: string; title: string; label: string; onEnded?: () => void; onProgress?: (fraction: number) => void };

/** Lesson clip with captions. Without a media store it shows the "in production" card. */
export const VideoPlayer = forwardRef<HTMLVideoElement, Props>(function VideoPlayer({ video, title, label, onEnded, onProgress }, ref) {
  if (video && MEDIA_BASE) {
    const base = `${MEDIA_BASE.replace(/\/$/, "")}/${video}`;
    return (
      <section aria-label={label} className="overflow-hidden rounded-tile bg-violet-deep">
        <video
          ref={ref}
          controls
          preload="metadata"
          playsInline
          poster={`${base}.jpg`}
          className="aspect-video w-full bg-black"
          onEnded={onEnded}
          onTimeUpdate={(e) => onProgress?.(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          crossOrigin="anonymous"
        >
          <source src={`${base}.mp4`} type="video/mp4" />
          <track kind="captions" src={`${base}.vtt`} srcLang="en" label="English (auto)" default />
          {title}
        </video>
      </section>
    );
  }
  return (
    <section aria-label={label} className="grid aspect-video place-items-center rounded-tile bg-violet-deep p-6 text-center">
      <p className="rounded-xl bg-[#140D3BE6] px-4 py-2 text-sm font-semibold text-white">Video in production. It will play here with captions on.</p>
    </section>
  );
});
