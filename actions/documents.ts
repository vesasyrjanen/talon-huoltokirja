'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { documentMetaSchema } from '@/lib/schemas/document'

export type DocumentActionState = {
  error?: string
  success?: string
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function uploadHouseDocumentAction(
  houseId: string,
  linkedSystemId: string | null,
  _prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const parsed = documentMetaSchema.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Valitse tiedosto' }
  }

  if (file.size === 0) {
    return { error: 'Tiedosto on tyhjä' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const bucket = 'house-documents'
  const timestamp = Date.now()
  const fileName = safeFileName(file.name)
  const storagePath = `${houseId}/${timestamp}-${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      house_id: houseId,
      linked_system_id: linkedSystemId,
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description || null,
      file_name: file.name,
      storage_bucket: bucket,
      storage_path: storagePath,
      mime_type: file.type || null,
      file_size_bytes: file.size,
      uploaded_by_user_id: user?.id ?? null,
    })

  if (dbError) {
    return { error: dbError.message }
  }

  revalidatePath(`/houses/${houseId}/documents`)
  if (linkedSystemId) {
    revalidatePath(`/houses/${houseId}/systems/${linkedSystemId}`)
    revalidatePath(`/houses/${houseId}/systems/${linkedSystemId}/documents`)
  }

  return { success: 'Dokumentti ladattu' }
}

export async function deleteDocumentAction(
  houseId: string,
  documentId: string,
  bucket: string,
  storagePath: string,
  linkedSystemId?: string | null
) {
  const supabase = await createClient()

  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove([storagePath])

  if (storageError) {
    throw new Error(storageError.message)
  }

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('house_id', houseId)
    .eq('id', documentId)

  if (dbError) {
    throw new Error(dbError.message)
  }

  revalidatePath(`/houses/${houseId}/documents`)
  if (linkedSystemId) {
    revalidatePath(`/houses/${houseId}/systems/${linkedSystemId}`)
    revalidatePath(`/houses/${houseId}/systems/${linkedSystemId}/documents`)
  }
}
