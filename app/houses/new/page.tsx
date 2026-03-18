'use client'

import { useActionState } from 'react'
import { createHouseAction, type CreateHouseState } from '@/actions/houses'

const initialState: CreateHouseState = {}

export default function NewHousePage() {
  const [state, formAction, pending] = useActionState(createHouseAction, initialState)

  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 16px' }}>
      <h1>Luo uusi rakennus</h1>
      <p style={{ color: '#555' }}>Anna rakennusn perustiedot. Tarkempia tietoja voi täydentää myöhemmin.</p>

      <form action={formAction} style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        <label>
          <div>Rakennuksen nimi</div>
          <input name="name" required style={inputStyle} />
        </label>

        <label>
          <div>Osoite</div>
          <input name="addressLine1" style={inputStyle} />
        </label>

        <label>
          <div>Postinumero</div>
          <input name="postalCode" style={inputStyle} />
        </label>

        <label>
          <div>Kaupunki</div>
          <input name="city" style={inputStyle} />
        </label>

        <label>
          <div>Rakennusvuosi</div>
          <input name="buildingYear" type="number" style={inputStyle} />
        </label>

        <label>
          <div>Rakennustyyppi</div>
          <input name="buildingType" placeholder="esim. omakotirakennus" style={inputStyle} />
        </label>

        <label>
          <div>Pinta-ala (m²)</div>
          <input name="areaM2" type="number" step="0.1" style={inputStyle} />
        </label>

        {state.error ? <p style={{ color: 'crimson' }}>{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          style={{
            width: 'fit-content',
            padding: '12px 16px',
            border: 'none',
            borderRadius: 10,
            background: '#0f172a',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {pending ? 'Tallennetaan...' : 'Luo rakennus'}
        </button>
      </form>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '6px',
  border: '1px solid #ccc',
  borderRadius: '8px',
}
