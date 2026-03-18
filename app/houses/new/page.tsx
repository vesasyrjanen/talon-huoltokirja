import Link from 'next/link'
import { createHouseAction } from '@/actions/houses'
import { Layout } from '@/components/layout/layout'
import { requireUser } from '@/lib/auth/require-user'

export default async function NewHousePage() {
  await requireUser()

  async function action(formData: FormData) {
    "use server"
    await createHouseAction({}, formData)
  }

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href="/dashboard" className="ui-back-link">← Takaisin etusivulle</Link>
        </p>

        <section>
          <h1 className="page-title">Uusi rakennus</h1>
          <p className="page-lead">
            Lisää uusi rakennus huoltokirjaan.
          </p>
        </section>

        <form action={action} className="ui-card" style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 600 }}>Rakennuksen nimi</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border px-3 py-2"
              placeholder="esim. Päärakennus, Navetta, Autotalli"
            />
          </div>

          <div className="ui-actions">
            <button className="ui-button-link primary" style={{ cursor: 'pointer' }}>
              Tallenna rakennus
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
