import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getMaintenanceById } from '@/lib/db/maintenance'
import { updateMaintenanceAction } from '@/actions/maintenance'
import { MaintenanceForm } from '@/components/maintenance/maintenance-form'
import { DeleteMaintenanceButton } from '@/components/maintenance/delete-maintenance-button'

type PageProps = {
  params: Promise<{ houseId: string; systemId: string; maintenanceId: string }>
}

export default async function MaintenanceDetailPage({ params }: PageProps) {
  const { houseId, systemId, maintenanceId } = await params
  await requireHouseMember(houseId)

  const item = await getMaintenanceById(houseId, systemId, maintenanceId)
  if (!item) notFound()

  const action = updateMaintenanceAction.bind(null, houseId, systemId, maintenanceId)

  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <p><Link href={`/houses/${houseId}/systems/${systemId}`}>← Takaisin järjestelmään</Link></p>
        <DeleteMaintenanceButton
          houseId={houseId}
          systemId={systemId}
          maintenanceId={maintenanceId}
        />
      </div>

      <h1>Muokkaa huoltomerkintää</h1>
      <p style={{ color: '#555' }}>
        Päivitä huollon tiedot tai poista merkintä.
      </p>

      <MaintenanceForm action={action} defaults={item} submitLabel="Tallenna muutokset" />
    </main>
  )
}
