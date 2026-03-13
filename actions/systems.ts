'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { systemSchema } from '@/lib/schemas/system'

export type SystemActionState = {
  error?: string
}

export async function createSystemAction(
  houseId: string,
  _prevState: SystemActionState,
  formData: FormData
): Promise<SystemActionState> {
  const parsed = systemSchema.safeParse({
    category: formData.get('category'),
    name: formData.get('name'),
    locationText: formData.get('locationText'),
    manufacturer: formData.get('manufacturer'),
    model: formData.get('model'),
    serialNumber: formData.get('serialNumber'),
    description: formData.get('description'),
    criticalInEmergency: formData.get('criticalInEmergency') === 'on',
    installDate: formData.get('installDate'),
    lastServiceDate: formData.get('lastServiceDate'),
    nextServiceDate: formData.get('nextServiceDate'),
    defaultServiceIntervalDays: formData.get('defaultServiceIntervalDays'),
    serviceIntervalNote: formData.get('serviceIntervalNote'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const input = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.from('systems').insert({
    house_id: houseId,
    category: input.category,
    name: input.name,
    location_text: input.locationText || null,
    manufacturer: input.manufacturer || null,
    model: input.model || null,
    serial_number: input.serialNumber || null,
    description: input.description || null,
    critical_in_emergency: Boolean(input.criticalInEmergency),
    install_date: input.installDate || null,
    last_service_date: input.lastServiceDate || null,
    next_service_date: input.nextServiceDate || null,
    default_service_interval_days: input.defaultServiceIntervalDays
      ? Number(input.defaultServiceIntervalDays)
      : null,
    service_interval_note: input.serviceIntervalNote || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/houses/${houseId}`)
  revalidatePath(`/houses/${houseId}/systems`)
  redirect(`/houses/${houseId}/systems`)
}

export async function updateSystemAction(
  houseId: string,
  systemId: string,
  _prevState: SystemActionState,
  formData: FormData
): Promise<SystemActionState> {
  const parsed = systemSchema.safeParse({
    category: formData.get('category'),
    name: formData.get('name'),
    locationText: formData.get('locationText'),
    manufacturer: formData.get('manufacturer'),
    model: formData.get('model'),
    serialNumber: formData.get('serialNumber'),
    description: formData.get('description'),
    criticalInEmergency: formData.get('criticalInEmergency') === 'on',
    installDate: formData.get('installDate'),
    lastServiceDate: formData.get('lastServiceDate'),
    nextServiceDate: formData.get('nextServiceDate'),
    defaultServiceIntervalDays: formData.get('defaultServiceIntervalDays'),
    serviceIntervalNote: formData.get('serviceIntervalNote'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const input = parsed.data
  const supabase = await createClient()

  const { error } = await supabase
    .from('systems')
    .update({
      category: input.category,
      name: input.name,
      location_text: input.locationText || null,
      manufacturer: input.manufacturer || null,
      model: input.model || null,
      serial_number: input.serialNumber || null,
      description: input.description || null,
      critical_in_emergency: Boolean(input.criticalInEmergency),
      install_date: input.installDate || null,
      last_service_date: input.lastServiceDate || null,
      next_service_date: input.nextServiceDate || null,
      default_service_interval_days: input.defaultServiceIntervalDays
        ? Number(input.defaultServiceIntervalDays)
        : null,
      service_interval_note: input.serviceIntervalNote || null,
    })
    .eq('house_id', houseId)
    .eq('id', systemId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/houses/${houseId}`)
  revalidatePath(`/houses/${houseId}/systems`)
  revalidatePath(`/houses/${houseId}/systems/${systemId}`)
  redirect(`/houses/${houseId}/systems/${systemId}`)
}

export async function archiveSystemAction(houseId: string, systemId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('systems')
    .update({ archived_at: new Date().toISOString() })
    .eq('house_id', houseId)
    .eq('id', systemId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/houses/${houseId}`)
  revalidatePath(`/houses/${houseId}/systems`)
  redirect(`/houses/${houseId}/systems`)
}
