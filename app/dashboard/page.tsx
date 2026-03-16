import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { requireUser } from "@/lib/auth/require-user";
import { getDashboardData } from "@/lib/db/dashboard";

import { Layout } from "@/components/layout/layout";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

import { QuickActions } from "@/components/dashboard/quick-actions";
import { HouseCard } from "@/components/dashboard/house-card";
import { OverdueMaintenanceCard } from "@/components/dashboard/overdue-maintenance-card";
import { UpcomingMaintenanceCard } from "@/components/dashboard/upcoming-maintenance-card";
import { RecentDocumentsCard } from "@/components/dashboard/recent-documents-card";

export default async function DashboardPage() {
  await requireUser();
  await syncUserProfile();

  const { houses, overdueMaintenance, upcomingMaintenance, recentDocuments } =
    await getDashboardData();

  return (
    <Layout>
      <div className="page-stack">
        <section>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-lead">
            Yhteenveto taloista, huolloista ja dokumenteista.
          </p>
        </section>

        <QuickActions />

        <section className="page-stack">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
            <div>
              <h2 className="section-title">Talot</h2>
              <p className="section-lead">Kaikki hallinnoimasi kohteet yhdessä näkymässä.</p>
            </div>
            <div className="ui-meta">{houses.length} kpl</div>
          </div>

          {houses.length === 0 ? (
            <Card>
              <h3 style={{ marginTop: 0 }}>Ei taloja vielä</h3>
              <p className="ui-meta">
                Lisää ensimmäinen talo, niin saat huoltokirjan käyttöön.
              </p>
              <div className="ui-actions" style={{ marginTop: 16 }}>
                <ButtonLink href="/houses/new" variant="primary">
                  Lisää talo
                </ButtonLink>
              </div>
            </Card>
          ) : (
            <div className="ui-grid cols-3">
              {houses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          )}
        </section>

        <section className="ui-grid cols-2">
          <OverdueMaintenanceCard items={overdueMaintenance} />
          <UpcomingMaintenanceCard items={upcomingMaintenance} />
        </section>

        <section>
          <RecentDocumentsCard items={recentDocuments} />
        </section>
      </div>
    </Layout>
  );
}
