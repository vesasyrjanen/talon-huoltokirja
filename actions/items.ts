"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { itemSchema } from "@/lib/schemas/item";

function normalizePrice(value: string | undefined) {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

export async function createItem(formData: FormData) {
  const parsed = itemSchema.safeParse({
    houseId: String(formData.get("houseId") ?? ""),
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    model: String(formData.get("model") ?? ""),
    serialNumber: String(formData.get("serialNumber") ?? ""),
    location: String(formData.get("location") ?? ""),
    purchaseDate: String(formData.get("purchaseDate") ?? ""),
    purchasePrice: String(formData.get("purchasePrice") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    archived: false,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Virheellinen syöte." };
  }

  const input = parsed.data;
  await requireHouseMember(input.houseId);

  const supabase = await createClient();

  const { error } = await supabase.from("items").insert({
    house_id: input.houseId,
    name: input.name,
    category: input.category || null,
    brand: input.brand || null,
    model: input.model || null,
    serial_number: input.serialNumber || null,
    location: input.location || null,
    purchase_date: input.purchaseDate || null,
    purchase_price: normalizePrice(input.purchasePrice),
    notes: input.notes || null,
    archived: false,
  });

  if (error) {
    return { error: "Irtaimiston tallennus epäonnistui." };
  }

  revalidatePath(`/houses/${input.houseId}`);
  revalidatePath(`/houses/${input.houseId}/items`);
  redirect(`/houses/${input.houseId}/items`);
}

export async function updateItem(formData: FormData) {
  const houseId = String(formData.get("houseId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");

  const parsed = itemSchema.safeParse({
    houseId,
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    model: String(formData.get("model") ?? ""),
    serialNumber: String(formData.get("serialNumber") ?? ""),
    location: String(formData.get("location") ?? ""),
    purchaseDate: String(formData.get("purchaseDate") ?? ""),
    purchasePrice: String(formData.get("purchasePrice") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    archived: String(formData.get("archived") ?? "") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Virheellinen syöte." };
  }

  await requireHouseMember(houseId);
  const supabase = await createClient();

  const { error } = await supabase
    .from("items")
    .update({
      name: parsed.data.name,
      category: parsed.data.category || null,
      brand: parsed.data.brand || null,
      model: parsed.data.model || null,
      serial_number: parsed.data.serialNumber || null,
      location: parsed.data.location || null,
      purchase_date: parsed.data.purchaseDate || null,
      purchase_price: normalizePrice(parsed.data.purchasePrice),
      notes: parsed.data.notes || null,
      archived: parsed.data.archived,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("house_id", houseId);

  if (error) {
    return { error: "Irtaimiston päivitys epäonnistui." };
  }

  revalidatePath(`/houses/${houseId}`);
  revalidatePath(`/houses/${houseId}/items`);
  revalidatePath(`/houses/${houseId}/items/${itemId}`);
  redirect(`/houses/${houseId}/items`);
}

export async function deleteItem(formData: FormData) {
  const houseId = String(formData.get("houseId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");

  await requireHouseMember(houseId);
  const supabase = await createClient();

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", itemId)
    .eq("house_id", houseId);

  if (error) {
    return { error: "Irtaimiston poisto epäonnistui." };
  }

  revalidatePath(`/houses/${houseId}`);
  revalidatePath(`/houses/${houseId}/items`);
  redirect(`/houses/${houseId}/items`);
}
