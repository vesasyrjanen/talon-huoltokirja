import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseById, getHouseSystems } from '@/lib/db/systems'
import { getHouseOverview } from '@/lib/db/house-overview'
import { SystemList } from '@/components/systems/system-list'
import { Layout } from '@/components/layout/layout'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/overview/stat-card'
import { RecentDocumentsOverview } from '@/components/overview/recent-documents-overview'
import { DeleteHouseButton } from '@/components/houses/delete-house-button'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function HousePage({ params }: PageProps) {
  const { houseId } = await params

  await requireHouseMember(houseId)

  const [house, systems, overview] = await Promise.all([
    getHouseById(houseId),
    getHouseSystems(houseId),
    getHouseOverview(houseId),
  ])

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
            <h2 className="section-title">Yhteenveto</h2>
            <p className="section-lead">Tärkeimmät tiedot yhdellä silmäyksellä.</p>
          </div>

          <div className="ui-grid cols-3">
            <StatCard label="Järjestelmiä" value={overview.systemsCount} />
            <StatCard label="Irtaimistoa" value={overview.itemsCount} />
            <StatCard label="Dokumentteja" value={overview.documentsCount} />
            <StatCard
              label="Myöhässä olevat huollot"
              value={overview.overdueCount}
              accent={overview.overdueCount > 0 ? "danger" : "default"}
            />
            <StatCard
              label="Seuraavat 30 päivän huollot"
              value={overview.upcomingCount}
            />
          </div>
        </section>

        <section className="ui-grid cols-2">
          <RecentDocumentsOverview houseId={houseId} items={overview.recentDocuments} />

          <Card>
            <h2 className="section-title" style={{ fontSize: 20 }}>Nopeat siirtymät</h2>
            <p className="section-lead">Yleisimmät toiminnot tälle talolle.</p>

            <div className="ui-actions" style={{ marginTop: 16 }}>
              <Link href={`/houses/${houseId}/systems/new`} className="ui-button-link primary">
                Lisää järjestelmä
              </Link>
              <Link href={`/houses/${houseId}/items/new`} className="ui-button-link subtle">
                Lisää irtaimisto
              </Link>
              <Link href={`/houses/${houseId}/documents`} className="ui-button-link subtle">
                Avaa dokumentit
              </Link>
            </div>
          </Card>
        </section>

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

          <div className="ui-actions">
            <Link href={`/houses/${houseId}/systems/new`} className="ui-button-link primary">
              Lisää uusi järjestelmä
            </Link>

            <DeleteHouseButton houseId={houseId} />
          </div>
        </section>
      </div>
    </Layout>
  )
}
