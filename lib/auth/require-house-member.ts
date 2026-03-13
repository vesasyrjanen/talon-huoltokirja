import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireHouseMember(houseId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('house_members')
    .select('id')
    .eq('house_id', houseId)
    .eq('user_id', user.id)
    .eq('invitation_status', 'active')
    .is('removed_at', null)
    .maybeSingle()

  if (error || !data) {
    redirect('/dashboard')
  }

  return user
}
