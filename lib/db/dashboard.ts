import { createClient } from "@/lib/supabase/server";

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

  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);
  const next30DaysString = next30Days.toISOString().slice(0, 10);

  const [housesRes, overdueRes, upcomingRes, recentDocsRes] = await Promise.all([
    supabase
      .from("houses")
      .select("id, name, created_at")
      .in("id", houseIds)
      .order("created_at", { ascending: false }),

    supabase
      .from("maintenance_events")
      .select(`
        id,
        next_service_date,
        system_id,
        systems (
          id,
          name,
          house_id
        )
      `)
      .not("next_service_date", "is", null)
      .lt("next_service_date", today)
      .order("next_service_date", { ascending: true })
      .limit(10),

    supabase
      .from("maintenance_events")
      .select(`
        id,
        next_service_date,
        system_id,
        systems (
          id,
          name,
          house_id
        )
      `)
      .not("next_service_date", "is", null)
      .gte("next_service_date", today)
      .lte("next_service_date", next30DaysString)
      .order("next_service_date", { ascending: true })
      .limit(10),

    supabase
      .from("documents")
      .select(`
        id,
        house_id,
        system_id,
        file_name,
        created_at
      `)
      .in("house_id", houseIds)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (housesRes.error) {
    console.error("housesRes.error", housesRes.error);
    throw new Error("Talojen haku epäonnistui.");
  }

  if (overdueRes.error) {
    console.error("overdueRes.error", overdueRes.error);
    throw new Error("Myöhässä olevien huoltojen haku epäonnistui.");
  }

  if (upcomingRes.error) {
    console.error("upcomingRes.error", upcomingRes.error);
    throw new Error("Tulevien huoltojen haku epäonnistui.");
  }

  if (recentDocsRes.error) {
    console.error("recentDocsRes.error", recentDocsRes.error);
    throw new Error("Viimeisimpien dokumenttien haku epäonnistui.");
  }

  return {
    houses: housesRes.data ?? [],
    overdueMaintenance: overdueRes.data ?? [],
    upcomingMaintenance: upcomingRes.data ?? [],
    recentDocuments: recentDocsRes.data ?? [],
  };
}
