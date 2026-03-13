'use client'

import { useTransition } from 'react'
import { deleteDocumentAction } from '@/actions/documents'

export function DeleteDocumentButton({
  houseId,
  documentId,
  bucket,
  storagePath,
  linkedSystemId,
}: {
  houseId: string
  documentId: string
  bucket: string
  storagePath: string
  linkedSystemId?: string | null
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('Poistetaanko dokumentti?')) return
        startTransition(async () => {
          await deleteDocumentAction(houseId, documentId, bucket, storagePath, linkedSystemId)
        })
      }}
      style={{
        padding: '8px 12px',
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
