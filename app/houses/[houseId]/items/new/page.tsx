import { requireHouseMember } from "@/lib/auth/require-house-member";
import { createItem } from "@/actions/items";
import { ItemForm } from "@/components/items/item-form";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;

  await requireHouseMember(houseId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Uusi irtaimisto</h1>
        <p className="mt-2 text-neutral-600">
          Lisää talolle laite, työkalu tai muu irtaimisto.
        </p>
      </div>

      <ItemForm action={createItem} houseId={houseId} />
    </div>
  );
}
