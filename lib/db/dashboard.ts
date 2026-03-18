import { createClient } from "@/lib/supabase/server";

type DashboardMaintenanceItem = {
  id: string;
  next_service_date: string;
  systems: {
    id: string;
    name: string;
    house_id: string;
  };
};

export async function getDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      houses: [],
      overdueMaintenance: [],
      upcomingMaintenance: [],
      recentDocuments: [],
    };
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("house_members")
    .select("house_id")
    .eq("user_id", user.id);

  if (membershipsError) {
    console.error("membershipsError", membershipsError);
    throw new Error("Talojen jäsenyyksien haku epäonnistui.");
  }

  const houseIds = (memberships ?? []).map((m) => m.house_id);

  if (houseIds.length === 0) {
    return {
      houses: [],
      overdueMaintenance: [],
      upcomingMaintenance: [],
      recentDocuments: [],
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  const next30 = new Date();
  next30.setDate(next30.getDate() + 30);
  const next30String = next30.toISOString().slice(0, 10);

  const [housesRes, systemsRes, maintenanceRes, recentDocsRes] = await Promise.all([
    supabase
      .from("houses")
      .select("id, name, created_at")
      .in("id", houseIds)
      .order("created_at", { ascending: false }),

    supabase
      .from("systems")
      .select("id, name, house_id")
      .in("house_id", houseIds)
      .eq("archived", false),

    supabase
      .from("maintenance_events")
      .select("id, system_id, next_service_date")
      .not("next_service_date", "is", null),

    supabase
      .from("documents")
      .select("id, house_id, system_id, file_name, created_at")
      .in("house_id", houseIds)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (housesRes.error) {
    console.error("housesRes.error", housesRes.error);
    throw new Error("Talojen haku epäonnistui.");
  }

  if (systemsRes.error) {
    console.error("systemsRes.error", systemsRes.error);
    throw new Error("Järjestelmien haku epäonnistui.");
  }

  if (maintenanceRes.error) {
    console.error("maintenanceRes.error", maintenanceRes.error);
    throw new Error("Huoltojen haku epäonnistui.");
  }

  if (recentDocsRes.error) {
    console.error("recentDocsRes.error", recentDocsRes.error);
    throw new Error("Viimeisimpien dokumenttien haku epäonnistui.");
  }

  const systems = systemsRes.data ?? [];
  const maintenance = maintenanceRes.data ?? [];
  const systemMap = new Map(systems.map((s) => [s.id, s]));

  const relevantMaintenance: DashboardMaintenanceItem[] = maintenance.flatMap((m) => {
    const system = systemMap.get(m.system_id);
    if (!system || !m.next_service_date) return [];

    return [
      {
        id: m.id,
        next_service_date: m.next_service_date,
        systems: {
          id: system.id,
          name: system.name,
          house_id: system.house_id,
        },
      },
    ];
  });

  const overdueMaintenance = relevantMaintenance.filter(
    (m) => m.next_service_date < today
  );

  const upcomingMaintenance = relevantMaintenance.filter(
    (m) =>
      m.next_service_date >= today &&
      m.next_service_date <= next30String
  );

  return {
    houses: housesRes.data ?? [],
    overdueMaintenance,
    upcomingMaintenance,
    recentDocuments: recentDocsRes.data ?? [],
  };
}
