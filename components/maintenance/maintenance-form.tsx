'use client'

import { useActionState } from 'react'
import type { MaintenanceActionState } from '@/actions/maintenance'

type Defaults = {
  title?: string
  event_type?: string
  performed_on?: string
  cost_amount?: number | null
  contractor_name?: string | null
  description?: string | null
  next_due_date?: string | null
}

export function MaintenanceForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (state: MaintenanceActionState, formData: FormData) => Promise<MaintenanceActionState>
  defaults?: Defaults
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, {})

  return (
    <form action={formAction} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
      <label>
        <div>Otsikko</div>
        <input name="title" required defaultValue={defaults?.title ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Tyyppi</div>
        <select name="eventType" defaultValue={defaults?.event_type ?? 'maintenance'} style={inputStyle}>
          <option value="maintenance">Huolto</option>
          <option value="repair">Korjaus</option>
          <option value="inspection">Tarkastus</option>
          <option value="service">Vuosihuolto / huoltopalvelu</option>
          <option value="other">Muu</option>
        </select>
      </label>

      <label>
        <div>Tehty päivänä</div>
        <input name="performedOn" type="date" required defaultValue={defaults?.performed_on ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Kustannus (€)</div>
        <input
          name="costAmount"
          type="number"
          step="0.01"
          defaultValue={defaults?.cost_amount?.toString() ?? ''}
          style={inputStyle}
        />
      </label>

      <label>
        <div>Tekijä / urakoitsija</div>
        <input name="contractorName" defaultValue={defaults?.contractor_name ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Seuraava huolto</div>
        <input name="nextDueDate" type="date" defaultValue={defaults?.next_due_date ?? ''} style={inputStyle} />
      </label>

      <label>
        <div>Kuvaus</div>
        <textarea name="description" rows={5} defaultValue={defaults?.description ?? ''} style={inputStyle} />
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
