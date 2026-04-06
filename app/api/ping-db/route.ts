import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // kevyt kysely
    await supabase.from('houses').select('id').limit(1)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('ping-db error', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
