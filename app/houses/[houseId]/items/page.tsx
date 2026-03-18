import Link from "next/link";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { getHouseItems } from "@/lib/db/items";
import { ItemList } from "@/components/items/item-list";
import { Layout } from "@/components/layout/layout";
import { getHouseById } from "@/lib/db/systems";
import { Card } from "@/components/ui/card";

export default async function HouseItemsPage({
  params,
  searchParams,
}: {
  params: Promise<{ houseId: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { houseId } = await params;
  const { created } = await searchParams;

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

        {created === "1" ? (
          <Card compact>
            <div style={{ fontWeight: 700 }}>Irtaimisto tallennettu</div>
            <div className="ui-meta" style={{ marginTop: 6 }}>
              Uusi kohde näkyy nyt listan kärjessä.
            </div>
          </Card>
        ) : null}

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
