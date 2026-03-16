import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getItemById } from "@/lib/db/items";
import { updateItem } from "@/actions/items";
import { ItemForm } from "@/components/items/item-form";
import { DeleteItemButton } from "@/components/items/delete-item-button";
import { Layout } from "@/components/layout/layout";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ houseId: string; itemId: string }>;
}) {
  const { houseId, itemId } = await params;

  await requireHouseMember(houseId);
  const item = await getItemById(itemId, houseId);

  if (!item) {
    notFound();
  }

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}/items`} className="ui-back-link">← Takaisin irtaimistoon</Link>
        </p>

        <section style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <h1 className="page-title">{item.name}</h1>
            <p className="page-lead">Muokkaa irtaimiston tietoja.</p>
          </div>

          <DeleteItemButton houseId={houseId} itemId={itemId} />
        </section>

        <div className="ui-actions">
          <Link
            href={`/qr/item/${item.id}`}
            className="ui-button-link subtle"
          >
            Avaa QR-koodi
          </Link>

          <Link
            href={`/houses/${houseId}/items/${item.id}/documents`}
            className="ui-button-link subtle"
          >
            Avaa dokumentit
          </Link>
        </div>

        <ItemForm action={updateItem} houseId={houseId} item={item} />
      </div>
    </Layout>
  );
}
