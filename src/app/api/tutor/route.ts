import { getVercelOidcToken } from "@vercel/oidc";
import { courseOfModule, lessonById, questionById } from "@/content/course";
import { rpc } from "@/lib/api";
import { pageText } from "@/lib/page-text";

const MODEL = "anthropic/claude-haiku-5.5";
type Msg = { role: "user" | "assistant"; content: string };

const system = (course: string, nursing: boolean) => `You are the Almanac tutor for students taking ${course}. Explain clearly and briefly (under 180 words), in plain language${nursing ? ", tying mechanisms to nursing assessment and priorities" : ""}.
Rules:
- Ground answers in the course page and question below. If the notes don't cover it and you aren't sure, say so and suggest asking a coach. Never invent lab values, doses or guidelines.
- Help the student reason; don't just hand over an answer letter. If they picked a wrong option, explain why it's tempting and why the keyed answer is better.
- Do not complete graded assignments, quizzes or exams from their school. If asked, decline kindly and offer to explain the concept.
- This is study help, not ${nursing ? "medical" : "professional"} advice.`;

function context(lessonId?: string, questionId?: string, selected?: string[]) {
  const parts: string[] = [];
  const l = lessonId ? lessonById(lessonId) : undefined;
  if (l) parts.push(pageText(l));
  const q = questionId ? questionById(questionId) : undefined;
  if (q) {
    parts.push(
      `QUESTION (${q.type === "multiple" ? "select all that apply" : "one best answer"}): ${q.stem}\n${q.ask}\n` +
        q.options.map((o) => `${o.id}) ${o.text}${q.correct.includes(o.id) ? " [KEYED CORRECT]" : ""}\n   Rationale: ${o.rationale}`).join("\n") +
        (selected?.length ? `\nThe student selected: ${selected.join(", ")}` : ""),
    );
  }
  return parts.join("\n\n");
}

export async function POST(req: Request) {
  let body: { token?: string; lessonId?: string; questionId?: string; selected?: string[]; messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const { token, lessonId, questionId, selected } = body;
  const messages = (body.messages ?? []).filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-10).map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!token || !messages.length) return Response.json({ error: "Bad request." }, { status: 400 });

  try {
    await rpc("pilot_me", { p_token: token });
  } catch {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  let auth: string;
  try {
    auth = process.env.AI_GATEWAY_API_KEY ?? (await getVercelOidcToken());
  } catch {
    return Response.json({ error: "The tutor isn't configured yet. Ask a coach instead." }, { status: 503 });
  }

  const ctx = context(lessonId, questionId, selected);
  const moduleId = (lessonId && lessonById(lessonId)?.moduleId) || (questionId && questionById(questionId)?.moduleId) || "";
  const course = courseOfModule(moduleId);
  const SYSTEM = system(course?.title ?? "an Almanac course", course?.reviewer !== "expert");
  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${auth}` },
    body: JSON.stringify({ model: MODEL, max_tokens: 500, temperature: 0.3, messages: [{ role: "system", content: SYSTEM + (ctx ? `\n\n---\n${ctx}` : "") }, ...messages] }),
  });
  if (!res.ok) {
    console.error("tutor gateway", res.status, (await res.text()).slice(0, 300));
    return Response.json({ error: "The tutor couldn't answer just now. Try again, or ask a coach." }, { status: 502 });
  }
  const data = await res.json();
  const answer: string = data.choices?.[0]?.message?.content?.trim() || "I'm not sure. Please ask a coach.";
  await rpc("tutor_log_add", { p_token: token, p_lesson_id: lessonId ?? null, p_question_id: questionId ?? null, p_prompt: messages.at(-1)!.content, p_answer: answer }).catch(() => {});
  return Response.json({ answer });
}
