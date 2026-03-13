import type { DocumentItem } from '@/lib/db/documents'
import { DeleteDocumentButton } from '@/components/documents/delete-document-button'

type SignedUrlMap = Record<string, string | null>

function categoryLabel(value: string) {
  switch (value) {
    case 'manual':
      return 'Käyttöohje'
    case 'drawing':
      return 'Piirustus'
    case 'report':
      return 'Raportti'
    case 'photo':
      return 'Valokuva'
    case 'receipt':
      return 'Kuitti'
    default:
      return 'Muu'
  }
}

export function DocumentList({
  houseId,
  items,
  signedUrls,
}: {
  houseId: string
  items: DocumentItem[]
  signedUrls: SignedUrlMap
}) {
  if (items.length === 0) {
    return (
      <section style={{ marginTop: 32, padding: 24, border: '1px dashed #ccc', borderRadius: 16 }}>
        <h2>Ei vielä dokumentteja</h2>
        <p style={{ color: '#555' }}>Lataa ensimmäinen dokumentti, käyttöohje, piirustus tai valokuva.</p>
      </section>
    )
  }

  return (
    <section style={{ marginTop: 32, display: 'grid', gap: 16 }}>
      {items.map((item) => (
        <article
          key={item.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 20,
            background: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ color: '#555', marginTop: 8 }}>
                {categoryLabel(item.category)} · {item.file_name}
              </p>
            </div>

            <DeleteDocumentButton
              houseId={houseId}
              documentId={item.id}
              bucket={item.storage_bucket}
              storagePath={item.storage_path}
              linkedSystemId={item.linked_system_id}
            />
          </div>

          <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
            {item.mime_type ? <p>MIME: {item.mime_type}</p> : null}
            {item.file_size_bytes ? <p>Koko: {item.file_size_bytes} tavua</p> : null}
            <p>Ladattu: {item.uploaded_at}</p>
          </div>

          {item.description ? <p style={{ marginTop: 12 }}>{item.description}</p> : null}

          {signedUrls[item.id] ? (
            <p style={{ marginTop: 16 }}>
              <a href={signedUrls[item.id] ?? '#'} target="_blank" rel="noreferrer">
                Avaa dokumentti
              </a>
            </p>
          ) : null}
        </article>
      ))}
    </section>
  )
}
