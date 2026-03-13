import { createClient } from '@/lib/supabase/server'

export type HouseListItem = {
  id: string
  name: string
  address_line1: string | null
  postal_code: string | null
  city: string | null
  building_year: number | null
  building_type: string | null
  area_m2: number | null
}

export async function getUserHouses(): Promise<HouseListItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('house_members')
    .select(`
      house:houses (
        id,
        name,
        address_line1,
        postal_code,
        city,
        building_year,
        building_type,
        area_m2
      )
    `)
    .eq('user_id', user.id)
    .eq('invitation_status', 'active')
    .is('removed_at', null)

  if (error) {
    throw error
  }

  return (data ?? [])
    .map((row) => row.house)
    .filter(Boolean) as HouseListItem[]
}
