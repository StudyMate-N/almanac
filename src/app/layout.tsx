import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Almanac: hard courses, broken into weekly steps",
    template: "%s · Almanac",
  },
  description:
    "Course companions that run alongside the course you're taking: short lessons, questions that explain every answer, spaced flashcards and practice exams built around your dates.",
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
