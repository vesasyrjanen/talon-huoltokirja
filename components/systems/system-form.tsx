'use client'

import { useActionState } from 'react'
import type { SystemActionState } from '@/actions/systems'

type Defaults = {
  category?: string
  name?: string
  location_text?: string | null
  manufacturer?: string | null
  model?: string | null
  serial_number?: string | null
  description?: string | null
  critical_in_emergency?: boolean
  install_date?: string | null
  last_service_date?: string | null
  next_service_date?: string | null
  default_service_interval_days?: number | null
  service_interval_note?: string | null
}

export function SystemForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (state: SystemActionState, formData: FormData) => Promise<SystemActionState>
  defaults?: Defaults
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, {})

  return (
    <form action={formAction} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
      <label>
        <div>Kategoria</div>
        <select name="category" defaultValue={defaults?.category ?? 'other'} style={inputStyle}>
          <option value="heating">Lämmitys</option>
          <option value="water">Vesi</option>
          <option value="electrical">Sähkö</option>
          <option value="ventilation">Ilmanvaihto</option>
          <option value="drainage">Salaojat / sadevesi</option>
          <option value="roof">Katto</option>
          <option value="fireplace">Takka / hormi</option>
          <option value="security">Turvallisuus</option>
          <option value="other">Muu</option>
        </select>
      </label>

      <label>
        <div>Nimi</div>
        <input name="name" required defaultValue={defaults?.name ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Sijainti</div>
        <input name="locationText" defaultValue={defaults?.location_text ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Valmistaja</div>
        <input name="manufacturer" defaultValue={defaults?.manufacturer ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Malli</div>
        <input name="model" defaultValue={defaults?.model ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Sarjanumero</div>
        <input name="serialNumber" defaultValue={defaults?.serial_number ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Asennuspäivä</div>
        <input name="installDate" type="date" defaultValue={defaults?.install_date ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Viimeisin huolto</div>
        <input name="lastServiceDate" type="date" defaultValue={defaults?.last_service_date ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Seuraava huolto</div>
        <input name="nextServiceDate" type="date" defaultValue={defaults?.next_service_date ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Oletushuoltoväli (päivää)</div>
        <input
          name="defaultServiceIntervalDays"
          type="number"
          defaultValue={defaults?.default_service_interval_days?.toString() ?? ''}
          style={inputStyle}
        />
      </label>

      <label>
        <div>Huoltovälin kuvaus</div>
        <input name="serviceIntervalNote" defaultValue={defaults?.service_interval_note ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Kuvaus / ohjeet</div>
        <textarea name="description" rows={5} defaultValue={defaults?.description ?? ''} style={inputStyle} />
      </label>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          name="criticalInEmergency"
          type="checkbox"
          defaultChecked={Boolean(defaults?.critical_in_emergency)}
        />
        <span>Kriittinen hätätilanteessa</span>
      </label>

      {state.error ? <p style={{ color: 'crimson' }}>{state.error}</p> : null}

      <button type="submit" disabled={pending} style={buttonStyle}>
        {pending ? 'Tallennetaan...' : submitLabel}
      </button>
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '6px',
  border: '1px solid #ccc',
  borderRadius: '8px',
}

const buttonStyle: React.CSSProperties = {
  width: 'fit-content',
  padding: '12px 16px',
  border: 'none',
  borderRadius: '10px',
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
}
