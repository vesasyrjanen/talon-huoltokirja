import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseDocuments, getSignedDocumentUrl } from '@/lib/db/documents'
import { uploadHouseDocumentAction } from '@/actions/documents'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'
import { DocumentList } from '@/components/documents/document-list'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HouseDocumentsPage({ params }: PageProps) {
  const { houseId } = await params
  await requireHouseMember(houseId)

  const items = await getHouseDocuments(houseId)
  const signedEntries = await Promise.all(
    items.map(async (item) => [
      item.id,
      await getSignedDocumentUrl(item.storage_bucket, item.storage_path),
    ] as const)
  )
  const signedUrls = Object.fromEntries(signedEntries)

  const action = uploadHouseDocumentAction.bind(null, houseId, null)

  return (
    <main style={{ maxWidth: 860, margin: '60px auto', padding: '0 16px' }}>
      <p><Link href={`/houses/${houseId}`}>← Takaisin taloon</Link></p>
      <h1>Dokumentit</h1>
      <p style={{ color: '#555' }}>
        Lataa taloon liittyvät käyttöohjeet, piirustukset, raportit ja valokuvat.
      </p>

      <DocumentUploadForm action={action} />
      <DocumentList houseId={houseId} items={items} signedUrls={signedUrls} />
    </main>
  )
}
