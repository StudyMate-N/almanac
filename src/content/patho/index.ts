/**
 * Advanced Pathophysiology: the course player knowledge base.
 * Start here, seven competency sections, and a final review.
 */
import { build } from "./author";
import { final } from "./final";
import { s1 } from "./s1";
import { s2 } from "./s2";
import { s3 } from "./s3";
import { s4 } from "./s4";
import { s5 } from "./s5";
import { s6 } from "./s6";
import { s7 } from "./s7";
import { start } from "./start";

export const patho = build([start, s1, s2, s3, s4, s5, s6, s7, final]);
export { clipById, clips } from "./clips";
