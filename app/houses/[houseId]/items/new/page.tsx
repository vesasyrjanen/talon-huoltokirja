import Link from "next/link";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { createItem } from "@/actions/items";
import { ItemForm } from "@/components/items/item-form";
import { Layout } from "@/components/layout/layout";
import { Card } from "@/components/ui/card";
import { getHouseById } from "@/lib/db/systems";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;

  await requireHouseMember(houseId);
  const house = await getHouseById(houseId);

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}/items`} className="ui-back-link">
            ← Takaisin irtaimistoon
          </Link>
        </p>

        <section>
          <h1 className="page-title">Lisää uusi irtaimisto</h1>
          <p className="page-lead">
            {house?.name}
          </p>
        </section>

        <div className="ui-grid cols-2">
          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Hyvä ensimmäinen lisäys</h2>
            <p className="section-lead">
              Lisää tähän esimerkiksi työkalu, kodinkone, kone tai muu hyödyllinen kohde,
              jonka dokumentit ja tiedot haluat löytää myöhemmin helposti.
            </p>

            <ul className="ui-meta" style={{ marginTop: 16, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Nimi riittää alkuun</li>
              <li>Voit täydentää muut tiedot myöhemmin</li>
              <li>Tallennuksen jälkeen kohde näkyy heti listassa</li>
            </ul>
          </Card>

          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Esimerkkejä</h2>
            <div className="ui-meta" style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              <div>• Bosch porakone</div>
              <div>• Stihl moottorisaha</div>
              <div>• Miele pesukone</div>
              <div>• Husqvarna ruohonleikkuri</div>
              <div>• Honda aggregaatti</div>
            </div>
          </Card>
        </div>

        <ItemForm action={createItem} houseId={houseId} />
      </div>
    </Layout>
  );
}
