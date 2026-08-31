import { Skeleton } from '@/components/ui/Skeleton';

export default function HaendlerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="accent-rule mb-3" />
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[13rem_1fr]">
        <nav className="space-y-1">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </nav>

        <div className="min-w-0 space-y-4">
          <div className="rounded-lg border border-line bg-surface-2">
            <div className="border-b border-line px-5 py-4">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-3 px-5 py-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-1 h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
