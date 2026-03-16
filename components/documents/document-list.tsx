import { getSignedDocumentUrl } from "@/lib/db/documents";
import { DeleteDocumentButton } from "@/components/documents/delete-document-button";

type LegacyItem = {
  id: string;
  file_name: string;
  storage_path: string;
  created_at: string;
};

type ModernItem = {
  id: string;
  file_name: string;
  storage_path: string;
  created_at: string;
};

type Props =
  | {
      documents: ModernItem[];
      houseId?: never;
      items?: never;
      signedUrls?: never;
    }
  | {
      houseId?: string;
      items: LegacyItem[];
      signedUrls?: Record<string, string | null>;
      documents?: never;
    };

export async function DocumentList(props: Props) {
  const documents =
    props.documents !== undefined
      ? await Promise.all(
          props.documents.map(async (doc) => ({
            ...doc,
            signedUrl: await getSignedDocumentUrl(doc.storage_path),
          }))
        )
      : props.items.map((item) => ({
          ...item,
          signedUrl: props.signedUrls?.[item.id] ?? null,
        }));

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium">Ei dokumentteja vielä</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Lisää ensimmäinen dokumentti tälle kohteelle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="text-lg font-medium">{doc.file_name}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Lisätty: {new Date(doc.created_at).toLocaleDateString("fi-FI")}
            </p>
            {doc.signedUrl ? (
              <a
                href={doc.signedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm underline"
              >
                Avaa dokumentti
              </a>
            ) : (
              <p className="mt-3 text-sm text-red-600">Tiedostoa ei löytynyt.</p>
            )}
          </div>

          <DeleteDocumentButton documentId={doc.id} />
        </div>
      ))}
    </div>
  );
}
