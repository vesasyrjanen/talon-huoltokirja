import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseById, getHouseSystems } from '@/lib/db/systems'
import { SystemList } from '@/components/systems/system-list'
import { Layout } from '@/components/layout/layout'
import { Card } from '@/components/ui/card'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HousePage({ params }: PageProps) {
  const { houseId } = await params

  await requireHouseMember(houseId)

  const house = await getHouseById(houseId)
  const systems = await getHouseSystems(houseId)

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href="/dashboard" className="ui-back-link">← Takaisin dashboardiin</Link>
        </p>

        <section>
          <h1 className="page-title">{house?.name}</h1>
          <p className="page-lead">Talon yhteenveto ja pääsy kaikkiin tietoihin.</p>
        </section>

        <nav className="ui-pill-nav">
          <Link href={`/houses/${houseId}/systems`}>Järjestelmät</Link>
          <Link href={`/houses/${houseId}/items`}>Irtaimisto</Link>
          <Link href={`/houses/${houseId}/documents`}>Dokumentit</Link>
        </nav>

        <section className="page-stack">
          <div>
            <h2 className="section-title">Järjestelmät</h2>
            <p className="section-lead">
              Talon tekniset järjestelmät ja niiden huoltohistoria.
            </p>
          </div>

          <Card>
            <SystemList houseId={houseId} items={systems} />
          </Card>

          <div>
            <Link href={`/houses/${houseId}/systems/new`} className="ui-button-link primary">
              Lisää uusi järjestelmä
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
