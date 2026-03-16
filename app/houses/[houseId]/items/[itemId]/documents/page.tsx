import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getItemById } from "@/lib/db/items";
import { getItemDocuments } from "@/lib/db/documents";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { DocumentList } from "@/components/documents/document-list";

export default async function ItemDocumentsPage({
  params,
}: {
  params: Promise<{ houseId: string; itemId: string }>;
}) {
  const { houseId, itemId } = await params;

  await requireHouseMember(houseId);

  const [item, documents] = await Promise.all([
    getItemById(itemId, houseId),
    getItemDocuments(houseId, itemId),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3">
          <Link href={`/houses/${houseId}/items/${itemId}`}>← Takaisin irtaimistoon</Link>
        </p>
        <h1 className="text-3xl font-semibold">Irtaimiston dokumentit</h1>
        <p className="mt-2 text-neutral-600">
          {item.name}
        </p>
      </div>

      <DocumentUploadForm houseId={houseId} itemId={itemId} />

      <DocumentList documents={documents} />
    </div>
  );
}
