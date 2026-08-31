import { Skeleton } from '@/components/ui/Skeleton';

export default function AutohausLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Skeleton className="h-3 w-32" />

      <div className="accent-rule mb-5 mt-4" />

      <div className="flex flex-wrap items-start gap-5">
        <Skeleton className="h-24 w-24 shrink-0 rounded-md" />
        <div className="min-w-0">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-36" />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface-2 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-3/4" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface-2 p-5">
          <Skeleton className="h-4 w-44" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface-2 p-5">
          <Skeleton className="h-4 w-32" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </div>
      </div>

      <Skeleton className="mt-10 h-6 w-28" />
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-lg border border-line bg-surface-2 p-5">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="mt-3 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
