import { createClient } from "@/lib/supabase/server";

export type HouseListItem = {
  id: string;
  name: string;
  address_line1: string | null;
  postal_code: string | null;
  city: string | null;
  building_year: number | null;
  building_type: string | null;
  area_m2: number | null;
};

export async function getUserHouses(userId: string): Promise<HouseListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("house_members")
    .select(`
      house:houses (
        id,
        name,
        address_line1,
        postal_code,
        city,
        building_year,
        building_type,
        area_m2
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("getUserHouses error", error);
    throw new Error("Talojen haku epäonnistui.");
  }

  const houses = (data ?? [])
    .map((row: any) => row.house)
    .flat()
    .filter(Boolean) as HouseListItem[];

  return houses;
}
