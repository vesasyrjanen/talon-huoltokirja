import Link from 'next/link'
import { requireHouseMember } from '@/lib/auth/require-house-member'
import { getHouseSystems, getHouseById } from '@/lib/db/systems'
import { SystemList } from '@/components/systems/system-list'
import { Layout } from '@/components/layout/layout'

type PageProps = {
  params: Promise<{ houseId: string }>
}

export default async function SystemsPage({ params }: PageProps) {
  const { houseId } = await params

  await requireHouseMember(houseId)

  const [house, systems] = await Promise.all([
    getHouseById(houseId),
    getHouseSystems(houseId),
  ])

  return (
    <Layout>
      <div className="page-stack">
        <p style={{ margin: 0 }}>
          <Link href={`/houses/${houseId}`} className="ui-back-link">← Takaisin rakennuson</Link>
        </p>

        <section>
          <h1 className="page-title">Järjestelmät</h1>
          <p className="page-lead">{house?.name}</p>
        </section>

        <div className="ui-actions">
          <Link href={`/houses/${houseId}/systems/new`} className="ui-button-link primary">
            Lisää järjestelmä
          </Link>
          <Link href={`/houses/${houseId}`} className="ui-button-link subtle">
            Takaisin rakennuson
          </Link>
        </div>

        <SystemList houseId={houseId} items={systems} />
      </div>
    </Layout>
  )
}
