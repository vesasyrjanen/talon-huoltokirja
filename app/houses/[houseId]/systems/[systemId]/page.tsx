import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getSystemById } from '@/lib/db/systems'
import { getSystemMaintenance } from '@/lib/db/maintenance'
import { updateSystemAction } from '@/actions/systems'
import { SystemForm } from '@/components/systems/system-form'
import { ArchiveSystemButton } from '@/components/systems/archive-system-button'
import { MaintenanceList } from '@/components/maintenance/maintenance-list'
import { Layout } from '@/components/layout/layout'

type PageProps = {
  params: Promise<{ houseId: string; systemId: string }>
}

export default async function SystemDetailPage({ params }: PageProps) {
  const { houseId, systemId } = await params
  await requireHouseMember(houseId)

  const [item, maintenance] = await Promise.all([
    getSystemById(houseId, systemId),
    getSystemMaintenance(houseId, systemId),
  ])

  if (!item) notFound()

  const action = updateSystemAction.bind(null, houseId, systemId)

  return (
    <Layout>
      <div className="page-stack">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ margin: 0 }}>
            <Link href={`/houses/${houseId}/systems`} className="ui-back-link">← Takaisin järjestelmiin</Link>
          </p>
          <ArchiveSystemButton houseId={houseId} systemId={systemId} />
        </div>

        <section>
          <h1 className="page-title">Muokkaa järjestelmää</h1>
          <p className="page-lead">
            Päivitä järjestelmän tiedot, huoltoväli ja hätätilamerkintä.
          </p>
        </section>

        <div className="ui-actions">
          <Link href={`/houses/${houseId}/systems/${systemId}/documents`} className="ui-button-link subtle">
            Avaa dokumentit
          </Link>
          <Link href={`/qr/system/${systemId}`} className="ui-button-link subtle">
            Avaa QR-koodi
          </Link>
        </div>

        <SystemForm action={action} defaults={item} submitLabel="Tallenna muutokset" />

        <section className="page-stack ui-divider-top">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 className="section-title">Huoltohistoria</h2>
              <p className="section-lead">Kirjaa huollot, korjaukset ja tarkastukset tälle järjestelmälle.</p>
            </div>
            <Link href={`/houses/${houseId}/systems/${systemId}/maintenance/new`} className="ui-button-link primary">
              Lisää huolto
            </Link>
          </div>

          <MaintenanceList houseId={houseId} systemId={systemId} items={maintenance} />
        </section>
      </div>
    </Layout>
  )
}
