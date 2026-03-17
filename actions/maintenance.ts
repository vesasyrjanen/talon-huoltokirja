'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { maintenanceSchema } from '@/lib/schemas/maintenance'
import { requireHouseMember } from '@/lib/auth/require-house-member'

export type MaintenanceActionState = {
  error?: string
  success?: string
}

function parseCost(value?: string) {
  if (!value) return null
  const num = Number(String(value).replace(',', '.'))
  return Number.isFinite(num) ? num : null
}

export async function createMaintenanceAction(
  houseId: string,
  systemId: string,
  _prevState: MaintenanceActionState,
  formData: FormData
): Promise<MaintenanceActionState> {
  await requireHouseMember(houseId)

  const parsed = maintenanceSchema.safeParse({
    title: String(formData.get('title') ?? ''),
    eventType: String(formData.get('eventType') ?? 'maintenance'),
    performedOn: String(formData.get('performedOn') ?? ''),
    costAmount: String(formData.get('costAmount') ?? ''),
    contractorName: String(formData.get('contractorName') ?? ''),
    description: String(formData.get('description') ?? ''),
    nextDueDate: String(formData.get('nextDueDate') ?? ''),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('maintenance_events').insert({
    house_id: houseId,
    system_id: systemId,
    title: parsed.data.title,
    event_type: parsed.data.eventType,
    performed_on: parsed.data.performedOn || null,
    description: parsed.data.description || null,
    performed_by: parsed.data.contractorName || null,
    cost: parseCost(parsed.data.costAmount),
    next_service_date: parsed.data.nextDueDate || null,
  })

  if (error) {
    console.error('createMaintenanceAction error', error)
    return { error: 'Huollon tallennus epäonnistui.' }
  }

  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}

export async function updateMaintenanceAction(
  houseId: string,
  systemId: string,
  maintenanceId: string,
  _prevState: MaintenanceActionState,
  formData: FormData
): Promise<MaintenanceActionState> {
  await requireHouseMember(houseId)

  const parsed = maintenanceSchema.safeParse({
    title: String(formData.get('title') ?? ''),
    eventType: String(formData.get('eventType') ?? 'maintenance'),
    performedOn: String(formData.get('performedOn') ?? ''),
    costAmount: String(formData.get('costAmount') ?? ''),
    contractorName: String(formData.get('contractorName') ?? ''),
    description: String(formData.get('description') ?? ''),
    nextDueDate: String(formData.get('nextDueDate') ?? ''),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('maintenance_events')
    .update({
      title: parsed.data.title,
      event_type: parsed.data.eventType,
      performed_on: parsed.data.performedOn || null,
      description: parsed.data.description || null,
      performed_by: parsed.data.contractorName || null,
      cost: parseCost(parsed.data.costAmount),
      next_service_date: parsed.data.nextDueDate || null,
    })
    .eq('id', maintenanceId)
    .eq('system_id', systemId)

  if (error) {
    console.error('updateMaintenanceAction error', error)
    return { error: 'Huollon päivitys epäonnistui.' }
  }

  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  revalidatePath(`/houses/${houseId}/systems/${systemId}/maintenance/${maintenanceId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}

export async function deleteMaintenanceAction(
  houseId: string,
  systemId: string,
  maintenanceId: string
): Promise<MaintenanceActionState> {
  await requireHouseMember(houseId)

  const supabase = await createClient()

  const { error } = await supabase
    .from('maintenance_events')
    .delete()
    .eq('id', maintenanceId)
    .eq('system_id', systemId)

  if (error) {
    console.error('deleteMaintenanceAction error', error)
    return { error: 'Huollon poisto epäonnistui.' }
  }

  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}
