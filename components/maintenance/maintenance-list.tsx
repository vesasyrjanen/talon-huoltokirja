import Link from 'next/link'
import type { MaintenanceItem } from '@/lib/db/maintenance'

function eventTypeLabel(value: string) {
  switch (value) {
    case 'maintenance':
      return 'Huolto'
    case 'repair':
      return 'Korjaus'
    case 'inspection':
      return 'Tarkastus'
    case 'service':
      return 'Huoltopalvelu'
    default:
      return 'Muu'
  }
}

export function MaintenanceList({
  houseId,
  systemId,
  items,
}: {
  houseId: string
  systemId: string
  items: MaintenanceItem[]
}) {
  if (items.length === 0) {
    return (
      <section style={{ marginTop: 32, padding: 24, border: '1px dashed #ccc', borderRadius: 16 }}>
        <h2>Ei vielä huoltomerkintöjä</h2>
        <p style={{ color: '#555' }}>Lisää ensimmäinen huolto, korjaus tai tarkastus.</p>
        <p style={{ marginTop: 16 }}>
          <Link href={`/houses/${houseId}/systems/${systemId}/maintenance/new`}>Lisää huolto</Link>
        </p>
      </section>
    )
  }

  return (
    <section style={{ marginTop: 32, display: 'grid', gap: 16 }}>
      {items.map((item) => (
        <article
          key={item.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 20,
            background: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ color: '#555', marginTop: 8 }}>
                {eventTypeLabel(item.event_type)} · {item.performed_on}
              </p>
            </div>
            <Link href={`/houses/${houseId}/systems/${systemId}/maintenance/${item.id}`}>Muokkaa</Link>
          </div>

          <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
            {item.cost_amount !== null ? <p>Kustannus: {item.cost_amount} €</p> : null}
            {item.contractor_name ? <p>Tekijä: {item.contractor_name}</p> : null}
            {item.next_due_date ? <p>Seuraava huolto: {item.next_due_date}</p> : null}
          </div>

          {item.description ? <p style={{ marginTop: 12 }}>{item.description}</p> : null}
        </article>
      ))}
    </section>
  )
}
