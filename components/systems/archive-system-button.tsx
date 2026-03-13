'use client'

import { useTransition } from 'react'
import { archiveSystemAction } from '@/actions/systems'

export function ArchiveSystemButton({
  houseId,
  systemId,
}: {
  houseId: string
  systemId: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('Arkistoidaanko järjestelmä?')) return
        startTransition(async () => {
          await archiveSystemAction(houseId, systemId)
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
      {pending ? 'Arkistoidaan...' : 'Arkistoi'}
    </button>
  )
}
