import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import "./almanac-public.css";

export const metadata: Metadata = {
  title: {
    default: "Almanac — Everything you need to make sense of your course & exams",
    template: "%s · Almanac",
  },
  description:
    "Almanac brings learning modules, clear lessons, video overviews, exam practice, flashcards, schedules and progress into one place. Browse courses or request a personalized learning companion.",
};

export const viewport: Viewport = {
  themeColor: "#5b3df5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
