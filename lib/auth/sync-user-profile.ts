import { createClient } from '@/lib/supabase/server'

export async function syncUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    null

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
      },
      { onConflict: 'id' }
    )

  if (error) {
    throw error
  }

  return user
}
