import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ maxWidth: 800, margin: '60px auto', padding: '0 16px' }}>
      <h1>Talon huoltokirja</h1>
      <p>Tämä on digitaalinen talon käyttö- ja huoltokirja.</p>
      <ul>
        <li><Link href="/login">Kirjaudu sisään</Link></li>
        <li><Link href="/dashboard">Avaa dashboard</Link></li>
      </ul>
    </main>
  )
}
