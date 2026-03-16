import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getSystemDocuments, getSignedDocumentUrl } from '@/lib/db/documents'
import { uploadSystemDocumentAction } from '@/actions/documents'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'
import { DocumentList } from '@/components/documents/document-list'

type PageProps = {
  params: Promise<{ houseId: string; systemId: string }>
}

export default async function SystemDocumentsPage({ params }: PageProps) {
  const { houseId, systemId } = await params
  await requireHouseMember(houseId)

  const items = await getSystemDocuments(houseId, systemId)
  const signedEntries = await Promise.all(
    items.map(async (item) => [
      item.id,
      await getSignedDocumentUrl(item.storage_bucket, item.storage_path),
    ] as const)
  )
  const signedUrls = Object.fromEntries(signedEntries)

  const action = uploadSystemDocumentAction.bind(null, houseId, systemId)

  return (
    <main style={{ maxWidth: 860, margin: '60px auto', padding: '0 16px' }}>
      <p><Link href={`/houses/${houseId}/systems/${systemId}`}>← Takaisin järjestelmään</Link></p>
      <h1>Järjestelmän dokumentit</h1>
      <p style={{ color: '#555' }}>
        Lataa tähän järjestelmään liittyvät käyttöohjeet, raportit, kuvat ja muut dokumentit.
      </p>

      <DocumentUploadForm action={action} />
      <DocumentList houseId={houseId} items={items} signedUrls={signedUrls} />
    </main>
  )
}
