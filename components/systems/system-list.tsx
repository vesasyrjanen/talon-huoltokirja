import Link from 'next/link'
import type { SystemListItem } from '@/lib/db/systems'

function categoryLabel(value: string) {
  switch (value) {
    case 'heating':
      return 'Lämmitys'
    case 'water':
      return 'Vesijärjestelmä'
    case 'electrical':
      return 'Sähkö'
    case 'ventilation':
      return 'Ilmanvaihto'
    case 'drainage':
      return 'Salaojat / sadevesi'
    case 'roof':
      return 'Katto'
    case 'fireplace':
      return 'Takka / hormi'
    case 'security':
      return 'Turvallisuus'
    default:
      return 'Muu'
  }
}

export function SystemList({
  houseId,
  items,
}: {
  houseId: string
  items: SystemListItem[]
}) {
  if (items.length === 0) {
    return (
      <section style={{ marginTop: 32, padding: 24, border: '1px dashed #ccc', borderRadius: 16 }}>
        <h2>Ei vielä järjestelmiä</h2>
        <p style={{ color: '#555' }}>
          Lisää ensimmäinen järjestelmä tai huoltokohde, kuten lämpöpumppu, IV-kone tai jätekaivo.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href={`/houses/${houseId}/systems/new`}>Lisää järjestelmä</Link>
        </p>
      </section>
    )
  }

  return (
    <section
      style={{
        marginTop: 32,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}
    >
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
              <h2 style={{ margin: 0 }}>{item.name}</h2>
              <p style={{ color: '#555', marginTop: 8 }}>
                {item.location_text || 'Sijaintia ei määritetty'}
              </p>
            </div>
            <span style={{ fontSize: 12, color: '#666' }}>{categoryLabel(item.category)}</span>
          </div>

          <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
            {item.manufacturer || item.model ? (
              <p>
                {[item.manufacturer, item.model].filter(Boolean).join(' ')}
              </p>
            ) : null}
            {item.next_service_date ? <p>Seuraava huolto: {item.next_service_date}</p> : null}
            {item.default_service_interval_days ? <p>Huoltoväli: {item.default_service_interval_days} pv</p> : null}
          </div>

          <p style={{ marginTop: 16 }}>
            <Link href={`/houses/${houseId}/systems/${item.id}`}>Avaa</Link>
          </p>
        </article>
      ))}
    </section>
  )
}
