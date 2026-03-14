import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystemById } from "@/lib/db/systems";
import { generateQrDataUrl } from "@/lib/qr/generate-qr-data-url";
import { getAppUrl } from "@/lib/config/app-url";

export default async function QrSystemPage({
  params,
}: {
  params: Promise<{ systemId: string }>;
}) {
  const { systemId } = await params;

  const system = await getSystemById(systemId);

  if (!system) {
    notFound();
  }

  const appUrl = getAppUrl();
  const targetUrl = `${appUrl}/houses/${system.house_id}/systems/${system.id}`;
  const qrDataUrl = await generateQrDataUrl(targetUrl);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">QR-koodi: järjestelmä</h1>
        <p className="mt-2 text-neutral-600">
          Skannaa QR-koodi puhelimella avataksesi järjestelmän suoraan.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">{system.name}</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Järjestelmän QR-koodi
        </p>

        <div className="mt-6 flex justify-center">
          <img
            src={qrDataUrl}
            alt={`QR-koodi järjestelmälle ${system.name}`}
            className="h-80 w-80 rounded-xl border bg-white p-3"
          />
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="font-medium">Kohdelinkki</div>
          <div className="break-all rounded-lg bg-neutral-50 p-3 text-neutral-700">
            {targetUrl}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={qrDataUrl}
            download={`qr-system-${system.id}.png`}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Lataa PNG
          </a>

          <Link
            href={`/houses/${system.house_id}/systems/${system.id}`}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Avaa järjestelmä
          </Link>
        </div>
      </div>
    </div>
  );
}
