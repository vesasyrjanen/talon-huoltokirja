import { createClient } from "@/lib/supabase/server";

export async function getSystemQrOverview(systemId: string) {
  const supabase = await createClient();

  const { data: system, error: systemError } = await supabase
    .from("systems")
    .select("id, house_id, name, category, manufacturer, model")
    .eq("id", systemId)
    .maybeSingle();

  if (systemError) {
    console.error("getSystemQrOverview systemError", systemError);
    throw new Error("QR overview: järjestelmän haku epäonnistui.");
  }

  if (!system) return null;

  const [documentsRes, maintenanceRes] = await Promise.all([
    supabase
      .from("documents")
      .select("id, file_name, created_at")
      .eq("house_id", system.house_id)
      .eq("system_id", system.id)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("maintenance_events")
      .select("id, title, performed_on, next_service_date")
      .eq("system_id", system.id)
      .order("performed_on", { ascending: false })
      .limit(5),
  ]);

  if (documentsRes.error) {
    console.error("getSystemQrOverview documentsRes.error", documentsRes.error);
    throw new Error("QR overview: dokumenttien haku epäonnistui.");
  }

  if (maintenanceRes.error) {
    console.error("getSystemQrOverview maintenanceRes.error", maintenanceRes.error);
    throw new Error("QR overview: huoltojen haku epäonnistui.");
  }

  return {
    system,
    documents: documentsRes.data ?? [],
    maintenance: maintenanceRes.data ?? [],
  };
}
