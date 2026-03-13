import { createClient } from '@/lib/supabase/server'

export type SystemListItem = {
  id: string
  category: string
  name: string
  location_text: string | null
  manufacturer: string | null
  model: string | null
  serial_number: string | null
  description: string | null
  critical_in_emergency: boolean
  install_date: string | null
  last_service_date: string | null
  next_service_date: string | null
  default_service_interval_days: number | null
  service_interval_note: string | null
}

export async function getHouseSystems(houseId: string): Promise<SystemListItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('systems')
    .select(`
      id,
      category,
      name,
      location_text,
      manufacturer,
      model,
      serial_number,
      description,
      critical_in_emergency,
      install_date,
      last_service_date,
      next_service_date,
      default_service_interval_days,
      service_interval_note
    `)
    .eq('house_id', houseId)
    .is('archived_at', null)
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []) as SystemListItem[]
}

export async function getSystemById(
  houseId: string,
  systemId: string
): Promise<SystemListItem | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('systems')
    .select(`
      id,
      category,
      name,
      location_text,
      manufacturer,
      model,
      serial_number,
      description,
      critical_in_emergency,
      install_date,
      last_service_date,
      next_service_date,
      default_service_interval_days,
      service_interval_note
    `)
    .eq('house_id', houseId)
    .eq('id', systemId)
    .is('archived_at', null)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as SystemListItem | null) ?? null
}

export async function getHouseById(houseId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('houses')
    .select('id, name, address_line1, postal_code, city')
    .eq('id', houseId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
