import Link from "next/link";
import { notFound } from "next/navigation";
import { generateQrDataUrl } from "@/lib/qr/generate-qr-data-url";
import { getAppUrl } from "@/lib/config/app-url";
import { getSystemQrOverview } from "@/lib/db/qr-overview";
import { Layout } from "@/components/layout/layout";
import { Card } from "@/components/ui/card";

export default async function QrSystemPage({
  params,
}: {
  params: Promise<{ systemId: string }>;
}) {
  const { systemId } = await params;

  const overview = await getSystemQrOverview(systemId);

  if (!overview) {
    notFound();
  }

  const { system, documents, maintenance } = overview;

  const appUrl = getAppUrl();
  const targetUrl = `${appUrl}/houses/${system.house_id}/systems/${system.id}`;
  const qrDataUrl = await generateQrDataUrl(targetUrl);

  return (
    <Layout>
      <div className="page-stack">
        <section>
          <h1 className="page-title">QR-demo: järjestelmä</h1>
          <p className="page-lead">
            Skannaa koodi puhelimella ja avaa järjestelmän tiedot suoraan käyttöpaikalla.
          </p>
        </section>

        <div className="qr-hero">
          <div className="qr-box">
            <h2 className="qr-title">{system.name}</h2>
            <p className="qr-subtitle">
              {system.manufacturer || system.model
                ? [system.manufacturer, system.model].filter(Boolean).join(" / ")
                : "Järjestelmän QR-koodi"}
            </p>

            <div className="qr-image-wrap" style={{ marginTop: 20 }}>
              <img
                src={qrDataUrl}
                alt={`QR-koodi järjestelmälle ${system.name}`}
                className="qr-image"
              />
            </div>

            <div className="ui-actions" style={{ marginTop: 20 }}>
              <a
                href={qrDataUrl}
                download={`qr-system-${system.id}.png`}
                className="ui-button-link primary"
              >
                Lataa PNG
              </a>

              <Link
                href={`/houses/${system.house_id}/systems/${system.id}`}
                className="ui-button-link subtle"
              >
                Avaa kohde
              </Link>
            </div>

            <div className="ui-meta" style={{ marginTop: 16, lineHeight: 1.6 }}>
              Kohdelinkki:
              <div style={{ marginTop: 6, wordBreak: "break-all" }}>{targetUrl}</div>
            </div>
          </div>

          <div className="qr-mobile-stack">
            <Card>
              <h2 className="section-title" style={{ fontSize: 20 }}>Käyttöpaikalla näkyvä hyöty</h2>
              <p className="section-lead">
                Kun QR-koodi on kiinni laitteessa, puhelimella pääsee heti oikeaan näkymään.
              </p>

              <div className="ui-actions" style={{ marginTop: 16 }}>
                <Link
                  href={`/houses/${system.house_id}/systems/${system.id}`}
                  className="ui-button-link primary"
                >
                  Muokkaa järjestelmää
                </Link>

                <Link
                  href={`/houses/${system.house_id}/systems/${system.id}/documents`}
                  className="ui-button-link subtle"
                >
                  Avaa dokumentit
                </Link>
              </div>
            </Card>

            <Card>
              <h2 className="section-title" style={{ fontSize: 20 }}>Viimeisimmät huollot</h2>

              {maintenance.length === 0 ? (
                <p className="ui-meta" style={{ marginTop: 14 }}>Ei huoltoja vielä.</p>
              ) : (
                <div className="qr-list">
                  {maintenance.map((item) => (
                    <div key={item.id} className="qr-list-item">
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      {item.performed_on ? (
                        <div className="ui-meta" style={{ marginTop: 4 }}>
                          Tehty: {item.performed_on}
                        </div>
                      ) : null}
                      {item.next_service_date ? (
                        <div className="ui-meta" style={{ marginTop: 4 }}>
                          Seuraava huolto: {item.next_service_date}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="section-title" style={{ fontSize: 20 }}>Uusimmat dokumentit</h2>

              {documents.length === 0 ? (
                <p className="ui-meta" style={{ marginTop: 14 }}>Ei dokumentteja vielä.</p>
              ) : (
                <div className="qr-list">
                  {documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/houses/${system.house_id}/systems/${system.id}/documents`}
                      className="qr-list-item"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{ fontWeight: 600 }}>{doc.file_name}</div>
                      <div className="ui-meta" style={{ marginTop: 4 }}>
                        Lisätty: {new Date(doc.created_at).toLocaleDateString("fi-FI")}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
