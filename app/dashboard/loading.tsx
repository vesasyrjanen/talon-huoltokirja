export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded bg-neutral-200" />
      <div className="h-28 animate-pulse rounded-2xl bg-neutral-200" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-neutral-200"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
      </div>

      <div className="h-80 animate-pulse rounded-2xl bg-neutral-200" />
    </div>
  );
}
