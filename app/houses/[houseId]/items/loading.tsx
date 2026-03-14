export default function ItemsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200" />
        ))}
      </div>
    </div>
  );
}
