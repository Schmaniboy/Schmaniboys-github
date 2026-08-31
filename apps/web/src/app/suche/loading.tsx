import { Skeleton } from '@/components/ui/Skeleton';

export default function SucheLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="accent-rule mb-3" />
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-3 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </aside>

        <div>
          <Skeleton className="mb-4 h-4 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border border-line bg-surface-2 p-4"
              >
                <Skeleton className="h-20 w-28 shrink-0 rounded" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
