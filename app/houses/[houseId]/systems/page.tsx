import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseSystems } from '@/lib/db/systems'
import { SystemList } from '@/components/systems/system-list'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function SystemsPage({ params }: PageProps) {
  const { houseId } = await params
  await requireHouseMember(houseId)
  const items = await getHouseSystems(houseId)

  return (
    <main style={{ maxWidth: 960, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}>
        <div>
          <h1>Järjestelmät ja huoltokohteet</h1>
          <p style={{ color: '#555' }}>
            Hallinnoi talon tekniikkaa, laitteita ja muita seurattavia kohteita.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href={`/houses/${houseId}`}>Talon sivu</Link>
          <Link href={`/houses/${houseId}/systems/new`}>Lisää järjestelmä</Link>
        </div>
      </div>

      <SystemList houseId={houseId} items={items} />
    </main>
  )
}
