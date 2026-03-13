'use client'

import { useActionState } from 'react'
import type { DocumentActionState } from '@/actions/documents'

export function DocumentUploadForm({
  action,
}: {
  action: (state: DocumentActionState, formData: FormData) => Promise<DocumentActionState>
}) {
  const [state, formAction, pending] = useActionState(action, {})

  return (
    <form action={formAction} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
      <label>
        <div>Nimi</div>
        <input name="title" required style={inputStyle} />
      </label>

      <label>
        <div>Kategoria</div>
        <select name="category" defaultValue="manual" style={inputStyle}>
          <option value="manual">Käyttöohje</option>
          <option value="drawing">Piirustus</option>
          <option value="report">Raportti</option>
          <option value="photo">Valokuva</option>
          <option value="receipt">Kuitti</option>
          <option value="other">Muu</option>
        </select>
      </label>

      <label>
        <div>Kuvaus</div>
        <textarea name="description" rows={4} style={inputStyle} />
      </label>

      <label>
        <div>Tiedosto</div>
        <input name="file" type="file" required style={inputStyle} />
      </label>

      {state.error ? <p style={{ color: 'crimson' }}>{state.error}</p> : null}
      {state.success ? <p style={{ color: 'green' }}>{state.success}</p> : null}

      <button type="submit" disabled={pending} style={buttonStyle}>
        {pending ? 'Ladataan...' : 'Lataa dokumentti'}
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
