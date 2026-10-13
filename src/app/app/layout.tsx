import type { Metadata } from "next";
import { Gate } from "@/components/gate";
import { StudentProvider } from "@/lib/store";

export const metadata: Metadata = { robots: { index: false } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <Gate>{children}</Gate>
    </StudentProvider>
  );
}
