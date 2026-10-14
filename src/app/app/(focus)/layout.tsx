import { PageTransition } from "@/components/page-transition";

export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ground">
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
