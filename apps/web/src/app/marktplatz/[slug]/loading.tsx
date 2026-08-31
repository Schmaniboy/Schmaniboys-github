import { Skeleton } from '@/components/ui/Skeleton';

export default function AnzeigeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-4 h-4 w-56" />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-lg" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-20 rounded" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-32" />
          <div className="rounded-lg border border-line bg-surface-2 p-4 space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface-2">
        <div className="border-b border-line px-5 py-4">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2 px-5 py-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}
