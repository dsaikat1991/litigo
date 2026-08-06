// Lightweight placeholders shown while each streamed widget's own data
// fetch is still in flight — sized to roughly match the real panel so
// swapping in the resolved content doesn't shift the layout.

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-muted animate-pulse rounded ${className}`} />;
}

function AttentionPanelSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="size-4" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function PracticeInsightsPanelSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <SkeletonBlock className="h-4 w-32" />
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border p-3">
            <SkeletonBlock className="size-4" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivityPanelSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-3 w-12" />
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonBlock className="h-5 w-16 shrink-0" />
            <div className="flex flex-1 flex-col gap-1.5">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AttentionPanel and RecentActivityPanel now stream as a single Suspense
// boundary (see DashboardSidePanelAsync) so they resolve together — this is
// their combined fallback, kept as one export so there's no way for the two
// halves to end up in different boundaries again by accident.
export function DashboardSidePanelSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <AttentionPanelSkeleton />
      <RecentActivityPanelSkeleton />
    </div>
  );
}

// Fallback for app/dashboard/loading.tsx — Next.js swaps this in instantly
// on navigation instead of blocking on the whole page's data waterfall,
// roughly sized to the real layout so nothing jumps once it resolves.
export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SkeletonBlock className="h-7 w-48" />
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-8 w-28" />
          <SkeletonBlock className="h-8 w-28" />
          <SkeletonBlock className="h-8 w-24" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-[52px] w-full rounded-xl" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-7 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3.5">
          <SkeletonBlock className="h-4 w-36" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>

        <SkeletonBlock className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}
