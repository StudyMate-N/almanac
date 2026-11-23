"use client";
import { useParams } from "next/navigation";
import { StudySprint } from "@/components/study-sprint";

/** A custom-order course in the shared study player (design 14a–14c; replaces 12a). */
export default function CustomerCoursePage() {
  const { orderId } = useParams<{ orderId: string }>();
  return <StudySprint source={{ kind: "order", orderId: String(orderId ?? "") }} />;
}
