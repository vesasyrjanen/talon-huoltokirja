import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getItemById } from "@/lib/db/items";
import { getItemDocuments } from "@/lib/db/documents";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { DocumentList } from "@/components/documents/document-list";
import { Layout } from "@/components/layout/layout";

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
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}/items/${itemId}`} className="ui-back-link">← Takaisin irtaimistoon</Link>
        </p>

        <section>
          <h1 className="page-title">Irtaimiston dokumentit</h1>
          <p className="page-lead">{item.name}</p>
        </section>

        <DocumentUploadForm houseId={houseId} itemId={itemId} />

        <DocumentList documents={documents} />
      </div>
    </Layout>
  );
}
