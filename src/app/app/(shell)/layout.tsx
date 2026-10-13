"use client";

import { Sidebar, TabBar } from "@/components/app-nav";
import { useStudent } from "@/lib/store";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const { preview, offline } = useStudent();
  return (
    <div className="min-h-dvh bg-ground lg:p-6">
      <div className="mx-auto flex max-w-[1360px] gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pt-5 pb-32 sm:px-6 lg:px-0 lg:pt-2 lg:pb-8">
          {preview && (
            <p className="mb-5 rounded-2xl bg-lilac px-4 py-2.5 text-[13px] font-medium text-ink-body">
              <span className="font-bold text-violet-700">Preview.</span> A coach is signed in on this device, so you can see items still awaiting nurse review. Students see only approved items.
            </p>
          )}
          {offline && (
            <p className="mb-5 rounded-2xl bg-peach px-4 py-2.5 text-[13px] font-medium text-peach-ink">You&apos;re offline. Your work is saved on this device and will sync when you reconnect.</p>
          )}
          {children}
        </main>
      </div>
      <TabBar />
    </div>
  );
}
