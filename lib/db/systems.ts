import { createClient } from "@/lib/supabase/server";

export type SystemListItem = {
  id: string;
  house_id: string;
  name: string;
  category: string | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  installed_at: string | null;
  archived: boolean;
  created_at: string;
};

export async function getHouseById(houseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("houses")
    .select("*")
    .eq("id", houseId)
    .maybeSingle();

  if (error) {
    console.error("getHouseById error", error);
    throw new Error("Talon haku epäonnistui.");
  }

  return data;
}

export async function getHouseSystems(houseId: string): Promise<SystemListItem[]> {
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

  return (data ?? []) as SystemListItem[];
}

export async function getSystemById(arg1: string, arg2?: string) {
  const supabase = await createClient();

  const houseId = arg2 ? arg1 : undefined;
  const systemId = arg2 ? arg2 : arg1;

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
