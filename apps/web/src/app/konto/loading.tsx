import { Skeleton } from '@/components/ui/Skeleton';

export default function KontoLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="accent-rule mb-3" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[13rem_1fr]">
        <nav className="space-y-1">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </nav>

        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-lg border border-line bg-surface-2 p-4"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-2 h-5 w-24" />
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface-2">
              <div className="border-b border-line px-5 py-4">
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-3 px-5 py-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-1 h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-surface-2">
              <div className="border-b border-line px-5 py-4">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 8 }, (_, i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
