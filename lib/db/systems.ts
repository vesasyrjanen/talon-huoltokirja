import { createClient } from "@/lib/supabase/server";

export async function getHouseSystems(houseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("systems")
    .select("*")
    .eq("house_id", houseId)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHouseSystems error", error);
    throw new Error("Järjestelmien haku epäonnistui.");
  }

  return data ?? [];
}

export async function getSystemById(systemId: string, houseId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("systems")
    .select("*")
    .eq("id", systemId);

  if (houseId) {
    query = query.eq("house_id", houseId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("getSystemById error", error);
    throw new Error("Järjestelmän haku epäonnistui.");
  }

  return data;
}
