'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireHouseMember } from '@/lib/auth/require-house-member'

export async function deleteHouseAction(houseId: string) {
  await requireHouseMember(houseId)

  const supabase = await createClient()

  // ⚠️ Poista riippuvuudet ensin

  await supabase.from('maintenance_events').delete().eq('house_id', houseId)
  await supabase.from('systems').delete().eq('house_id', houseId)
  await supabase.from('items').delete().eq('house_id', houseId)
  await supabase.from('documents').delete().eq('house_id', houseId)
  await supabase.from('house_members').delete().eq('house_id', houseId)

  const { error } = await supabase
    .from('houses')
    .delete()
    .eq('id', houseId)

  if (error) {
    console.error('deleteHouse error', error)
    throw new Error('Talon poisto epäonnistui.')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
