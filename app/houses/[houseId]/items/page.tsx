import Link from "next/link";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getHouseItems } from "@/lib/db/items";
import { ItemList } from "@/components/items/item-list";
import { Layout } from "@/components/layout/layout";
import { getHouseById } from "@/lib/db/systems";

export default async function HouseItemsPage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;

  await requireHouseMember(houseId);

  const [house, items] = await Promise.all([
    getHouseById(houseId),
    getHouseItems(houseId),
  ]);

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}`} className="ui-back-link">← Takaisin taloon</Link>
        </p>

        <section>
          <h1 className="page-title">Irtaimisto</h1>
          <p className="page-lead">
            {house?.name}
          </p>
        </section>

        <div className="ui-actions">
          <Link
            href={`/houses/${houseId}/items/new`}
            className="ui-button-link primary"
          >
            Lisää irtaimisto
          </Link>
          <Link href={`/houses/${houseId}`} className="ui-button-link subtle">
            Takaisin taloon
          </Link>
        </div>

        <ItemList items={items} houseId={houseId} />
      </div>
    </Layout>
  );
}
