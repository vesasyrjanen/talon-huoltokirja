import Link from "next/link";
import { Card } from "@/components/ui/card";

type Doc = {
  id: string;
  file_name: string;
  created_at: string;
  system_id: string | null;
  item_id: string | null;
};

export function RecentDocumentsOverview({
  houseId,
  items,
}: {
  houseId: string;
  items: Doc[];
}) {
  return (
    <Card>
      <h2 className="section-title" style={{ fontSize: 20 }}>Uusimmat dokumentit</h2>
      <p className="section-lead">Viimeksi lisätyt tiedostot tässä rakennusssa.</p>

      {items.length === 0 ? (
        <p className="ui-meta" style={{ marginTop: 16 }}>
          Ei dokumentteja vielä.
        </p>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.map((doc) => {
            const href = doc.system_id
              ? `/houses/${houseId}/systems/${doc.system_id}/documents`
              : doc.item_id
              ? `/houses/${houseId}/items/${doc.item_id}/documents`
              : `/houses/${houseId}/documents`;

            return (
              <Link
                key={doc.id}
                href={href}
                className="ui-link-card"
                style={{ padding: 14 }}
              >
                <div style={{ fontWeight: 600 }}>{doc.file_name}</div>
                <div className="ui-meta" style={{ marginTop: 6 }}>
                  Lisätty: {new Date(doc.created_at).toLocaleDateString("fi-FI")}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
