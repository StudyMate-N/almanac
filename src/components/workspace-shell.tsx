"use client";
import { MobileTopBar, Sidebar, TabBar } from "@/components/app-nav";
import { PageTransition } from "@/components/page-transition";
import { useStudent } from "@/lib/store";

/**
 * Learner workspace shell (design handoff 6a/6b, "Workspace layout").
 * Desktop: 232px white sidebar running the full height, content on ground #F7F6FB.
 * Mobile: 56px top bar plus the bottom tab bar. The coach preview is a one-line
 * lilac strip at the top of the content column.
 */
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { preview, offline } = useStudent();
  return (
    <div className="alm-workspace min-h-dvh bg-[#F7F6FB]">
      <MobileTopBar />
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {preview && (
            <div role="status" className="bg-lilac px-4 py-2 text-[12px] leading-snug text-violet-deep sm:px-8">
              <b>Preview.</b> A coach is signed in on this device, so you can see items still awaiting nurse review. Students see only approved items.
            </div>
          )}
          {offline && (
            <div role="status" className="bg-[#FFF4EC] px-4 py-2 text-[12px] leading-snug text-[#A8430A] sm:px-8">
              <b>Offline.</b> Your study progress is saved on this device and will sync when you reconnect.
            </div>
          )}
          <main className="mx-auto w-full max-w-[1208px] min-w-0 flex-1 px-4 pt-5 pb-28 sm:px-8 lg:pt-6 lg:pb-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <TabBar />
    </div>
  );
}
