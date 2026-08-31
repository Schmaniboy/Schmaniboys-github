import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="accent-rule mb-3" />
        <Skeleton className="h-7 w-36" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[13rem_1fr]">
        <nav className="space-y-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </nav>

        <div className="min-w-0 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-lg border border-line bg-surface-2 p-4"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-line bg-surface-2">
            <div className="border-b border-line px-5 py-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-3 px-5 py-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
