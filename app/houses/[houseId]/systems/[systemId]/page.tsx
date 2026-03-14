import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getSystemById } from '@/lib/db/systems'
import { getSystemMaintenance } from '@/lib/db/maintenance'
import { updateSystemAction } from '@/actions/systems'
import { SystemForm } from '@/components/systems/system-form'
import { ArchiveSystemButton } from '@/components/systems/archive-system-button'
import { MaintenanceList } from '@/components/maintenance/maintenance-list'

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
    <main style={{ maxWidth: 860, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <p><Link href={`/houses/${houseId}/systems`}>← Takaisin järjestelmiin</Link></p>
        <ArchiveSystemButton houseId={houseId} systemId={systemId} />
      </div>

      <h1>Muokkaa järjestelmää</h1>
      <p style={{ color: '#555' }}>
        Päivitä järjestelmän tiedot, huoltoväli ja hätätilamerkintä.
      </p>

      <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link href={`/houses/${houseId}/systems/${systemId}/documents`}>Avaa dokumentit</Link>
        <Link href={`/qr/system/${systemId}`}>Avaa QR-koodi</Link>
      </div>

      <SystemForm action={action} defaults={item} submitLabel="Tallenna muutokset" />

      <section style={{ marginTop: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}>
          <div>
            <h2>Huoltohistoria</h2>
            <p style={{ color: '#555' }}>Kirjaa huollot, korjaukset ja tarkastukset tälle järjestelmälle.</p>
          </div>
          <Link href={`/houses/${houseId}/systems/${systemId}/maintenance/new`}>Lisää huolto</Link>
        </div>

        <MaintenanceList houseId={houseId} systemId={systemId} items={maintenance} />
      </section>
    </main>
  )
}
