import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseDocuments, getSignedDocumentUrl } from '@/lib/db/documents'
import { uploadHouseDocumentAction } from '@/actions/documents'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'
import { DocumentList } from '@/components/documents/document-list'
import { Layout } from '@/components/layout/layout'
import { getHouseById } from '@/lib/db/systems'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HouseDocumentsPage({ params }: PageProps) {
  const { houseId } = await params
  await requireHouseMember(houseId)

  const [house, items] = await Promise.all([
    getHouseById(houseId),
    getHouseDocuments(houseId),
  ])

  const signedEntries = await Promise.all(
    items.map(async (item) => [
      item.id,
      await getSignedDocumentUrl(item.storage_bucket, item.storage_path),
    ] as const)
  )
  const signedUrls = Object.fromEntries(signedEntries)

  const action = uploadHouseDocumentAction.bind(null, houseId, null)

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}`} className="ui-back-link">← Takaisin taloon</Link>
        </p>

        <section>
          <h1 className="page-title">Talon dokumentit</h1>
          <p className="page-lead">{house?.name}</p>
        </section>

        <DocumentUploadForm action={action} />
        <DocumentList houseId={houseId} items={items} signedUrls={signedUrls} />
      </div>
    </Layout>
  )
}
