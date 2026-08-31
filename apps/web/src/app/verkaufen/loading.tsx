import { Skeleton } from '@/components/ui/Skeleton';

export default function VerkaufenLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-lg" />

      <div className="mt-6 rounded-lg border border-line bg-surface-2 p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-3/4" />
      </div>

      <div className="mt-8 space-y-4">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
