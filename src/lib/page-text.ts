import { cardById, questionById } from "@/content/course";
import { clipById } from "@/content/patho";
import type { Block, Lesson } from "@/content/types";

const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** One block as plain text, for the tutor's context and the study guide. */
export function blockText(b: Block): string {
  switch (b.t) {
    case "h2":
      return `## ${b.text}`;
    case "p":
      return strip(b.html);
    case "ul":
    case "ol":
      return b.items.map((i) => `- ${strip(i)}`).join("\n");
    case "table":
      return [b.head.join(" | "), ...b.rows.map((r) => r.map(strip).join(" | "))].join("\n");
    case "callout":
      return `${b.title}: ${strip(b.html)}`;
    case "case":
      return `Case, ${b.title}: ${strip(b.html)}`;
    case "labs":
      return [`Labs (${b.cols.join(", ")}):`, ...b.rows.map((r) => r.slice(0, -1).join(" "))].join("\n");
    case "eq":
      return `Essential question: ${b.text}`;
    case "video": {
      const c = clipById(b.clip);
      if (!c) return "";
      const fixes = c.corrections.map((x) => `Video said "${x.said}" -> correct: ${x.correct}`).join("\n- ");
      return `Video clip: ${c.title}.${fixes ? `\nCorrections to the video (the video is wrong here):\n- ${fixes}` : ""}`;
    }
    case "check": {
      const q = questionById(b.id);
      return q ? `Learning check: ${q.stem} ${q.ask}` : "";
    }
    case "open":
      return `Prompt: ${b.stem}\nExpert answer: ${b.expert}`;
    case "cards":
      return b.ids
        .map((id) => cardById(id))
        .filter(Boolean)
        .map((c) => `- ${c!.front}: ${c!.back}`)
        .join("\n");
    case "read":
      return `Reading: ${b.items.map((i) => i.ref).join("; ")}`;
    default:
      return "";
  }
}

export function pageText(page: Lesson, max = 9000): string {
  const text = [`PAGE: ${page.groupTitle} / ${page.title}`, ...page.blocks.filter((b) => b.t !== "quiz").map(blockText)].filter(Boolean).join("\n\n");
  return text.length > max ? text.slice(0, max) + "…" : text;
}
