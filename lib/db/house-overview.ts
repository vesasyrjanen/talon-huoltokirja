import { createClient } from "@/lib/supabase/server";

export type HouseOverviewData = {
  systemsCount: number;
  itemsCount: number;
  documentsCount: number;
  overdueCount: number;
  upcomingCount: number;
  recentDocuments: {
    id: string;
    file_name: string;
    created_at: string;
    system_id: string | null;
    item_id: string | null;
  }[];
};

export async function getHouseOverview(houseId: string): Promise<HouseOverviewData> {
  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);

  const next30 = new Date();
  next30.setDate(next30.getDate() + 30);
  const next30String = next30.toISOString().slice(0, 10);

  const [
    systemsRes,
    itemsRes,
    docsRes,
    overdueRes,
    upcomingRes,
    recentDocsRes,
  ] = await Promise.all([
    supabase
      .from("systems")
      .select("id", { count: "exact", head: true })
      .eq("house_id", houseId)
      .eq("archived", false),

    supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .eq("house_id", houseId)
      .eq("archived", false),

    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("house_id", houseId),

    supabase
      .from("maintenance_events")
      .select("id", { count: "exact", head: true })
      .in(
        "system_id",
        (
          await supabase
            .from("systems")
            .select("id")
            .eq("house_id", houseId)
            .eq("archived", false)
        ).data?.map((x) => x.id) ?? ["00000000-0000-0000-0000-000000000000"]
      )
      .not("next_service_date", "is", null)
      .lt("next_service_date", today),

    supabase
      .from("maintenance_events")
      .select("id", { count: "exact", head: true })
      .in(
        "system_id",
        (
          await supabase
            .from("systems")
            .select("id")
            .eq("house_id", houseId)
            .eq("archived", false)
        ).data?.map((x) => x.id) ?? ["00000000-0000-0000-0000-000000000000"]
      )
      .not("next_service_date", "is", null)
      .gte("next_service_date", today)
      .lte("next_service_date", next30String),

    supabase
      .from("documents")
      .select("id, file_name, created_at, system_id, item_id")
      .eq("house_id", houseId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (systemsRes.error) {
    console.error("getHouseOverview systemsRes.error", systemsRes.error);
    throw new Error("Talon overview: järjestelmien haku epäonnistui.");
  }

  if (itemsRes.error) {
    console.error("getHouseOverview itemsRes.error", itemsRes.error);
    throw new Error("Talon overview: irtaimiston haku epäonnistui.");
  }

  if (docsRes.error) {
    console.error("getHouseOverview docsRes.error", docsRes.error);
    throw new Error("Talon overview: dokumenttien haku epäonnistui.");
  }

  if (overdueRes.error) {
    console.error("getHouseOverview overdueRes.error", overdueRes.error);
    throw new Error("Talon overview: myöhässä olevien huoltojen haku epäonnistui.");
  }

  if (upcomingRes.error) {
    console.error("getHouseOverview upcomingRes.error", upcomingRes.error);
    throw new Error("Talon overview: tulevien huoltojen haku epäonnistui.");
  }

  if (recentDocsRes.error) {
    console.error("getHouseOverview recentDocsRes.error", recentDocsRes.error);
    throw new Error("Talon overview: uusimpien dokumenttien haku epäonnistui.");
  }

  return {
    systemsCount: systemsRes.count ?? 0,
    itemsCount: itemsRes.count ?? 0,
    documentsCount: docsRes.count ?? 0,
    overdueCount: overdueRes.count ?? 0,
    upcomingCount: upcomingRes.count ?? 0,
    recentDocuments: recentDocsRes.data ?? [],
  };
}
