import { createClient } from "@/lib/supabase/server";

export async function getHouseDocuments(houseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("house_id", houseId)
    .is("system_id", null)
    .is("item_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHouseDocuments error", error);
    throw new Error("Dokumenttien haku epäonnistui.");
  }

  return data ?? [];
}

export async function getSystemDocuments(houseId: string, systemId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("house_id", houseId)
    .eq("system_id", systemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSystemDocuments error", error);
    throw new Error("Järjestelmän dokumenttien haku epäonnistui.");
  }

  return data ?? [];
}

export async function getItemDocuments(houseId: string, itemId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("house_id", houseId)
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getItemDocuments error", error);
    throw new Error("Irtaimiston dokumenttien haku epäonnistui.");
  }

  return data ?? [];
}

export async function getSignedDocumentUrl(
  bucketOrPath: string,
  maybePath?: string
) {
  const supabase = await createClient();

  const bucket = maybePath ? bucketOrPath : "HOUSE-DOCUMENTS";
  const storagePath = maybePath ?? bucketOrPath;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, 60 * 10);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
