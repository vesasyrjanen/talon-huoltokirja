import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { createSystemAction } from '@/actions/systems'
import { SystemForm } from '@/components/systems/system-form'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function NewSystemPage({ params }: PageProps) {
  const { houseId } = await params
  await requireHouseMember(houseId)
  const action = createSystemAction.bind(null, houseId)

  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 16px' }}>
      <p><Link href={`/houses/${houseId}/systems`}>← Takaisin järjestelmiin</Link></p>
      <h1>Lisää järjestelmä</h1>
      <p style={{ color: '#555' }}>
        Voit lisätä teknisen järjestelmän tai muun huoltokohteen, kuten jätekaivon.
      </p>

      <SystemForm action={action} submitLabel="Tallenna järjestelmä" />
    </main>
  )
}
