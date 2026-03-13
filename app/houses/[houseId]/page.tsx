import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseById, getHouseSystems } from '@/lib/db/systems'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HouseDetailPage({ params }: PageProps) {
  const { houseId } = await params
  await requireHouseMember(houseId)

  const [house, systems] = await Promise.all([
    getHouseById(houseId),
    getHouseSystems(houseId),
  ])

  return (
    <main style={{ maxWidth: 960, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}>
        <div>
          <h1>{house?.name ?? 'Talo'}</h1>
          <p style={{ color: '#555' }}>
            {[house?.address_line1, house?.postal_code, house?.city].filter(Boolean).join(', ')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href={`/houses/${houseId}/systems`}>Järjestelmät</Link>
          <Link href={`/houses/${houseId}/documents`}>Dokumentit</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Yhteenveto</h2>
        <p>Tässä talossa on {systems.length} aktiivista järjestelmää tai huoltokohdetta.</p>
        <p style={{ display: 'flex', gap: 16 }}>
          <Link href={`/houses/${houseId}/systems/new`}>Lisää järjestelmä</Link>
          <Link href={`/houses/${houseId}/documents`}>Avaa dokumentit</Link>
        </p>
      </section>
    </main>
  )
}
