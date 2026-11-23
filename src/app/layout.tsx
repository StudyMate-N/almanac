import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import "./almanac-public.css";
import "./almanac-workspace.css";

export const metadata: Metadata = {
  title: {
    default: "Almanac — Everything you need to make sense of your course & exams",
    template: "%s · Almanac",
  },
  description:
    "Almanac brings learning modules, clear lessons, video overviews, exam practice, flashcards, schedules and progress into one place. Browse courses or request a personalized learning companion.",
  icons: { icon: "/almanac-art/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Almanac",
    title: "Almanac — Everything you need to make sense of your course & exams",
    description: "Study materials, modules, video overviews, practice, flashcards and progress — organized around you.",
    images: [{url:"/almanac-art/og-default.png",width:1200,height:630,alt:"Almanac learning, organized around you"}]
  },
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
