'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createHouseSchema } from '@/lib/schemas/house'
import { syncUserProfile } from '@/lib/auth/sync-user-profile'

export type CreateHouseState = {
  error?: string
}

export async function createHouseAction(
  _prevState: CreateHouseState,
  formData: FormData
): Promise<CreateHouseState> {
  const parsed = createHouseSchema.safeParse({
    name: formData.get('name'),
    addressLine1: formData.get('addressLine1'),
    postalCode: formData.get('postalCode'),
    city: formData.get('city'),
    buildingYear: formData.get('buildingYear'),
    buildingType: formData.get('buildingType'),
    areaM2: formData.get('areaM2'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Virheellinen syöte' }
  }

  const input = parsed.data
  const user = await syncUserProfile()

  if (!user) {
    return { error: 'Kirjautuminen vaaditaan' }
  }

  const supabase = await createClient()
  const houseId = crypto.randomUUID()

  const { error: houseError } = await supabase
    .from('houses')
    .insert({
      id: houseId,
      name: input.name,
      address_line1: input.addressLine1 || null,
      postal_code: input.postalCode || null,
      city: input.city || null,
      building_year: input.buildingYear ? Number(input.buildingYear) : null,
      building_type: input.buildingType || null,
      area_m2: input.areaM2 ? Number(input.areaM2) : null,
      created_by_user_id: user.id,
    })

  if (houseError) {
    return { error: houseError.message }
  }

  const { error: memberError } = await supabase
    .from('house_members')
    .insert({
      house_id: houseId,
      user_id: user.id,
      role: 'owner',
      invitation_status: 'active',
      joined_at: new Date().toISOString(),
      permissions_json: {
        can_edit_house: true,
        can_manage_members: true,
        can_add_maintenance: true,
        can_upload_documents: true,
        can_manage_inventory: true,
      },
    })

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
