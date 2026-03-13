import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { createMaintenanceAction } from '@/actions/maintenance'
import { MaintenanceForm } from '@/components/maintenance/maintenance-form'

type PageProps = {
  params: Promise<{ houseId: string; systemId: string }>
}

export default async function NewMaintenancePage({ params }: PageProps) {
  const { houseId, systemId } = await params
  await requireHouseMember(houseId)

  const action = createMaintenanceAction.bind(null, houseId, systemId)

  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 16px' }}>
      <p><Link href={`/houses/${houseId}/systems/${systemId}`}>← Takaisin järjestelmään</Link></p>
      <h1>Lisää huolto</h1>
      <p style={{ color: '#555' }}>
        Lisää huolto, korjaus, tarkastus tai muu tehty toimenpide.
      </p>

      <MaintenanceForm action={action} submitLabel="Tallenna huolto" />
    </main>
  )
}
