import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseById, getHouseSystems } from '@/lib/db/systems'
import { SystemList } from '@/components/systems/system-list'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HousePage({ params }: PageProps) {
  const { houseId } = await params

  await requireHouseMember(houseId)

  const house = await getHouseById(houseId)
  const systems = await getHouseSystems(houseId)

  return (
    <main style={{ maxWidth: 900, margin: '60px auto', padding: '0 16px' }}>
      <p>
        <Link href="/dashboard">← Takaisin dashboardiin</Link>
      </p>

      <h1>{house?.name}</h1>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 24,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href={`/houses/${houseId}/systems`}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            textDecoration: 'none',
          }}
        >
          Järjestelmät
        </Link>

        <Link
          href={`/houses/${houseId}/items`}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            textDecoration: 'none',
          }}
        >
          Irtaimisto
        </Link>

        <Link
          href={`/houses/${houseId}/documents`}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            textDecoration: 'none',
          }}
        >
          Dokumentit
        </Link>
      </div>

      <section>
        <h2>Järjestelmät</h2>
        <p style={{ color: '#555' }}>
          Talon tekniset järjestelmät ja niiden huoltohistoria.
        </p>

        <div style={{ marginTop: 16 }}>
          <SystemList houseId={houseId} items={systems} />
        </div>

        <p style={{ marginTop: 16 }}>
          <Link href={`/houses/${houseId}/systems/new`}>
            Lisää uusi järjestelmä
          </Link>
        </p>
      </section>
    </main>
  )
}
