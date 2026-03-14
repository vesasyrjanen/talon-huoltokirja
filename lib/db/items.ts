import { createClient } from "@/lib/supabase/server";

export async function getHouseItems(houseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("house_id", houseId)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHouseItems error", error);
    throw new Error("Irtaimiston haku epäonnistui.");
  }

  return data ?? [];
}

export async function getItemById(itemId: string, houseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .eq("house_id", houseId)
    .maybeSingle();

  if (error) {
    console.error("getItemById error", error);
    throw new Error("Irtaimiston haku epäonnistui.");
  }

  return data;
}
