import { createClient } from '@/lib/supabase/server'

export type DocumentItem = {
  id: string
  house_id: string
  linked_system_id: string | null
  title: string
  category: string
  description: string | null
  file_name: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
  file_size_bytes: number | null
  uploaded_at: string
}

export async function getHouseDocuments(houseId: string): Promise<DocumentItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('documents')
    .select(`
      id,
      house_id,
      linked_system_id,
      title,
      category,
      description,
      file_name,
      storage_bucket,
      storage_path,
      mime_type,
      file_size_bytes,
      uploaded_at
    `)
    .eq('house_id', houseId)
    .is('deleted_at', null)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as DocumentItem[]
}

export async function getSystemDocuments(
  houseId: string,
  systemId: string
): Promise<DocumentItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('documents')
    .select(`
      id,
      house_id,
      linked_system_id,
      title,
      category,
      description,
      file_name,
      storage_bucket,
      storage_path,
      mime_type,
      file_size_bytes,
      uploaded_at
    `)
    .eq('house_id', houseId)
    .eq('linked_system_id', systemId)
    .is('deleted_at', null)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as DocumentItem[]
}

export async function getSignedDocumentUrl(bucket: string, path: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 10)

  if (error) throw error
  return data?.signedUrl ?? null
}
