'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { maintenanceSchema } from '@/lib/schemas/maintenance'

export type MaintenanceActionState = {
  error?: string
}

export async function createMaintenanceAction(
  houseId: string,
  systemId: string,
  _prevState: MaintenanceActionState,
  formData: FormData
): Promise<MaintenanceActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const parsed = maintenanceSchema.safeParse({
    title: formData.get('title'),
    eventType: formData.get('eventType'),
    performedOn: formData.get('performedOn'),
    costAmount: formData.get('costAmount'),
    contractorName: formData.get('contractorName'),
    description: formData.get('description'),
    nextDueDate: formData.get('nextDueDate'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const input = parsed.data

  const { error } = await supabase
    .from('maintenance_events')
    .insert({
      house_id: houseId,
      system_id: systemId,
      title: input.title,
      event_type: input.eventType,
      performed_on: input.performedOn,
      cost_amount: input.costAmount ? Number(input.costAmount) : null,
      contractor_name: input.contractorName || null,
      description: input.description || null,
      next_due_date: input.nextDueDate || null,
      created_by_user_id: user?.id ?? null,
    })

  if (error) {
    return { error: error.message }
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
  const parsed = maintenanceSchema.safeParse({
    title: formData.get('title'),
    eventType: formData.get('eventType'),
    performedOn: formData.get('performedOn'),
    costAmount: formData.get('costAmount'),
    contractorName: formData.get('contractorName'),
    description: formData.get('description'),
    nextDueDate: formData.get('nextDueDate'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const input = parsed.data
  const supabase = await createClient()

  const { error } = await supabase
    .from('maintenance_events')
    .update({
      title: input.title,
      event_type: input.eventType,
      performed_on: input.performedOn,
      cost_amount: input.costAmount ? Number(input.costAmount) : null,
      contractor_name: input.contractorName || null,
      description: input.description || null,
      next_due_date: input.nextDueDate || null,
    })
    .eq('house_id', houseId)
    .eq('system_id', systemId)
    .eq('id', maintenanceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}

export async function deleteMaintenanceAction(
  houseId: string,
  systemId: string,
  maintenanceId: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('maintenance_events')
    .delete()
    .eq('house_id', houseId)
    .eq('system_id', systemId)
    .eq('id', maintenanceId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}
