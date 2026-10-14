import { clipById } from "@/content/patho";
import type { Block, Lesson } from "@/content/types";

const strip = (s: string) => s.replace(/<[^>]+>/g, " ");
const count = (s: string) => strip(s).split(/\s+/).filter(Boolean).length;

/** Reading words on a page: prose, lists, tables, key points and callouts only (not rationales). */
export function readingWords(blocks: Block[]) {
  let words = 0;
  for (const b of blocks) {
    if (b.t === "p") words += count(b.html);
    else if (b.t === "ul" || b.t === "ol" || b.t === "keypoints") words += b.items.reduce((n, i) => n + count(i), 0);
    else if (b.t === "table") words += [...b.head, ...b.rows.flat()].reduce((n, c) => n + count(c), 0);
    else if (b.t === "callout") words += count(b.title) + count(b.html);
  }
  return words;
}

/** About how long a page takes: reading at 200 words a minute, plus time to answer and write. */
export function minutesFor(p: Lesson) {
  let extra = 0;
  for (const b of p.blocks) {
    if (b.t === "check") extra += 1.5;
    else if (b.t === "quiz") extra += b.ids.length * 1.2;
    else if (b.t === "predict") extra += 0.5;
    else if (b.t === "open") extra += 2;
    else if (b.t === "video") {
      const d = clipById(b.clip)?.duration;
      extra += d ? d.split(":").reduce((a, x) => a * 60 + Number(x), 0) / 60 : 6;
    }
  }
  return Math.max(2, Math.round(readingWords(p.blocks) / 200 + extra));
}
