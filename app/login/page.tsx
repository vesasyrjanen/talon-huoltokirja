'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const signIn = async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Tarkista sähköpostisi. Kirjautumislinkki on lähetetty.')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '100px auto', padding: '0 16px' }}>
      <h1>Kirjaudu sisään</h1>

      <input
        type="email"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '16px',
          marginBottom: '12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />

      <button
        onClick={signIn}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          borderRadius: '8px',
          background: '#0f172a',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Lähetä kirjautumislinkki
      </button>

      <p style={{ marginTop: '16px' }}>{message}</p>
    </main>
  )
}
