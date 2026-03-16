import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getSystemDocuments, getSignedDocumentUrl } from '@/lib/db/documents'
import { uploadSystemDocumentAction } from '@/actions/documents'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'
import { DocumentList } from '@/components/documents/document-list'
import { Layout } from '@/components/layout/layout'

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
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}/systems/${systemId}`} className="ui-back-link">← Takaisin järjestelmään</Link>
        </p>

        <section>
          <h1 className="page-title">Järjestelmän dokumentit</h1>
          <p className="page-lead">
            Lataa tähän järjestelmään liittyvät käyttöohjeet, raportit, kuvat ja muut dokumentit.
          </p>
        </section>

        <DocumentUploadForm action={action} />
        <DocumentList houseId={houseId} items={items} signedUrls={signedUrls} />
      </div>
    </Layout>
  )
}
