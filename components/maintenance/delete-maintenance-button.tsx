'use client'

import { useTransition } from 'react'
import { deleteMaintenanceAction } from '@/actions/maintenance'

export function DeleteMaintenanceButton({
  houseId,
  systemId,
  maintenanceId,
}: {
  houseId: string
  systemId: string
  maintenanceId: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('Poistetaanko huoltomerkintä?')) return
        startTransition(async () => {
          await deleteMaintenanceAction(houseId, systemId, maintenanceId)
        })
      }}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #ef4444',
        background: '#fff5f5',
        color: '#b91c1c',
        cursor: 'pointer',
      }}
    >
      {pending ? 'Poistetaan...' : 'Poista'}
    </button>
  )
}
