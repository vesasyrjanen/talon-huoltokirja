import { syncUserProfile } from "@/lib/auth/sync-user-profile";
import { requireUser } from "@/lib/auth/require-user";
import { getDashboardData } from "@/lib/db/dashboard";

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
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-neutral-600">
          Yhteenveto taloista, huolloista ja dokumenteista.
        </p>
      </section>

      <QuickActions />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Talot</h2>
          <span className="text-sm text-neutral-500">{houses.length} kpl</span>
        </div>

        {houses.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium">Ei taloja vielä</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Lisää ensimmäinen talo, niin saat huoltokirjan käyttöön.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {houses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <OverdueMaintenanceCard items={overdueMaintenance} />
        <UpcomingMaintenanceCard items={upcomingMaintenance} />
      </section>

      <section>
        <RecentDocumentsCard items={recentDocuments} />
      </section>
    </div>
  );
}
