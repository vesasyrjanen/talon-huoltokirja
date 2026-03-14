import Link from "next/link";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getHouseItems } from "@/lib/db/items";
import { ItemList } from "@/components/items/item-list";

export default async function HouseItemsPage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;

  await requireHouseMember(houseId);
  const items = await getHouseItems(houseId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Irtaimisto</h1>
          <p className="mt-2 text-neutral-600">
            Talon laitteet, työkalut ja muu omaisuus.
          </p>
        </div>

        <Link
          href={`/houses/${houseId}/items/new`}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Lisää irtaimisto
        </Link>
      </div>

      <ItemList items={items} houseId={houseId} />
    </div>
  );
}
