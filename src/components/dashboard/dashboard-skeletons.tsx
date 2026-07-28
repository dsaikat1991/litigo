// Lightweight placeholders shown while each streamed widget's own data
// fetch is still in flight — sized to roughly match the real panel so
// swapping in the resolved content doesn't shift the layout.

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-muted animate-pulse rounded ${className}`} />;
}

export function AttentionPanelSkeleton() {
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

export function RecentActivityPanelSkeleton() {
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
