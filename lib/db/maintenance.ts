import { createClient } from '@/lib/supabase/server'

export type MaintenanceItem = {
  id: string
  title: string
  event_type: string
  performed_on: string
  cost_amount: number | null
  contractor_name: string | null
  description: string | null
  next_due_date: string | null
}

export async function getSystemMaintenance(
  houseId: string,
  systemId: string
): Promise<MaintenanceItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('maintenance_events')
    .select(`
      id,
      title,
      event_type,
      performed_on,
      cost_amount,
      contractor_name,
      description,
      next_due_date
    `)
    .eq('house_id', houseId)
    .eq('system_id', systemId)
    .order('performed_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as MaintenanceItem[]
}

export async function getMaintenanceById(
  houseId: string,
  systemId: string,
  maintenanceId: string
): Promise<MaintenanceItem | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('maintenance_events')
    .select(`
      id,
      title,
      event_type,
      performed_on,
      cost_amount,
      contractor_name,
      description,
      next_due_date
    `)
    .eq('house_id', houseId)
    .eq('system_id', systemId)
    .eq('id', maintenanceId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as MaintenanceItem | null) ?? null
}
