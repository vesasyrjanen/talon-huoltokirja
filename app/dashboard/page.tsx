import Link from 'next/link'
import { requireUser } from '@/lib/auth/require-user'
import { syncUserProfile } from '@/lib/auth/sync-user-profile'
import { getUserHouses } from '@/lib/db/houses'

export default async function DashboardPage() {
  await requireUser()
  await syncUserProfile()
  const houses = await getUserHouses()

  return (
    <main style={{ maxWidth: 960, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}>
        <div>
          <h1>Taloni</h1>
          <p style={{ color: '#555' }}>Hallinnoi taloja ja avaa niiden huoltokirjat.</p>
        </div>
        <Link href="/houses/new">Luo uusi talo</Link>
      </div>

      {houses.length === 0 ? (
        <section style={{ marginTop: 32, padding: 24, border: '1px dashed #ccc', borderRadius: 16 }}>
          <h2>Ei vielä taloja</h2>
          <p style={{ color: '#555' }}>Aloita luomalla ensimmäinen talo.</p>
          <p style={{ marginTop: 16 }}>
            <Link href="/houses/new">Luo ensimmäinen talo</Link>
          </p>
        </section>
      ) : (
        <section
          style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {houses.map((house) => (
            <article
              key={house.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 16,
                padding: 20,
                background: 'white',
              }}
            >
              <h2 style={{ margin: 0 }}>
                <Link href={`/houses/${house.id}`}>{house.name}</Link>
              </h2>
              <p style={{ color: '#555', marginTop: 8 }}>
                {[house.address_line1, house.postal_code, house.city].filter(Boolean).join(', ') || 'Osoitetta ei annettu'}
              </p>
              <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
                {house.building_year ? <p>Rakennusvuosi: {house.building_year}</p> : null}
                {house.building_type ? <p>Tyyppi: {house.building_type}</p> : null}
                {house.area_m2 ? <p>Pinta-ala: {house.area_m2} m²</p> : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
