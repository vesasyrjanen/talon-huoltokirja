import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getItemById } from "@/lib/db/items";
import { updateItem } from "@/actions/items";
import { ItemForm } from "@/components/items/item-form";
import { DeleteItemButton } from "@/components/items/delete-item-button";

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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{item.name}</h1>
          <p className="mt-2 text-neutral-600">
            Muokkaa irtaimiston tietoja.
          </p>

          <div className="mt-4">
            <Link
              href={`/qr/item/${item.id}`}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Avaa QR-koodi
            </Link>
          </div>
        </div>

        <DeleteItemButton houseId={houseId} itemId={itemId} />
      </div>

      <ItemForm action={updateItem} houseId={houseId} item={item} />
    </div>
  );
}
