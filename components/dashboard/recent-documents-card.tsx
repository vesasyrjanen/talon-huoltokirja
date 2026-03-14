import Link from "next/link";

type RecentDocument = {
  id: string;
  house_id: string;
  system_id: string | null;
  file_name: string;
  created_at: string;
};

export function RecentDocumentsCard({
  items,
}: {
  items: RecentDocument[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Viimeisimmät dokumentit</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          Ei dokumentteja vielä.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((doc) => {
            const href = doc.system_id
              ? `/houses/${doc.house_id}/systems/${doc.system_id}/documents`
              : `/houses/${doc.house_id}/documents`;

            return (
              <Link
                key={doc.id}
                href={href}
                className="block rounded-xl border p-3 hover:bg-neutral-50"
              >
                <div className="font-medium">{doc.file_name}</div>
                <div className="text-sm text-neutral-500">
                  Lisätty: {new Date(doc.created_at).toLocaleDateString("fi-FI")}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
