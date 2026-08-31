import { Skeleton } from '@/components/ui/Skeleton';

export default function KatalogDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-4 h-4 w-48" />
      <div className="accent-rule mb-3" />
      <Skeleton className="h-7 w-52" />
      <Skeleton className="mt-2 h-4 w-80" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border border-line bg-surface-2 p-5"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
