import Link from 'next/link'

type SystemListItem = {
  id: string
  name: string
  category?: string | null
  location_text?: string | null
  manufacturer?: string | null
  model?: string | null
  serial_number?: string | null
  installed_at?: string | null
  next_service_date?: string | null
  default_service_interval_days?: number | null
  is_emergency?: boolean | null
}

function categoryLabel(value: string) {
  switch (value) {
    case 'heating':
      return 'Lämmitys'
    case 'ventilation':
      return 'Ilmanvaihto'
    case 'water':
      return 'Vesi'
    case 'drain':
      return 'Viemäröinti'
    case 'electricity':
      return 'Sähkö'
    case 'roof':
      return 'Katto'
    case 'foundation':
      return 'Perustus'
    case 'outdoor':
      return 'Piha'
    case 'appliance':
      return 'Laite'
    default:
      return value || 'Muu'
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
      <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <p style={{ margin: 0 }}>Ei järjestelmiä vielä.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/houses/${houseId}/systems/${item.id}`}
          style={{
            display: 'block',
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 16,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h2 style={{ margin: 0 }}>{item.name}</h2>
              <p style={{ color: '#555', marginTop: 8 }}>
                {item.location_text || 'Sijaintia ei määritetty'}
              </p>
            </div>
            <span style={{ fontSize: 12, color: '#666' }}>
              {categoryLabel(item.category ?? '')}
            </span>
          </div>

          <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
            {item.manufacturer || item.model ? (
              <p>
                {[item.manufacturer, item.model].filter(Boolean).join(' / ')}
              </p>
            ) : null}
            {item.serial_number ? <p>Sarjanumero: {item.serial_number}</p> : null}
            {item.installed_at ? <p>Asennettu: {item.installed_at}</p> : null}
            {item.next_service_date ? <p>Seuraava huolto: {item.next_service_date}</p> : null}
            {item.default_service_interval_days ? (
              <p>Huoltoväli: {item.default_service_interval_days} pv</p>
            ) : null}
            {item.is_emergency ? <p>Merkitty hätätilajärjestelmäksi</p> : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
