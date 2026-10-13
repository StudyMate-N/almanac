import type { Metadata } from "next";
import { Review } from "@/components/review";

export const metadata: Metadata = { title: "Card review" };

export default function ReviewPage() {
  return <Review />;
}
