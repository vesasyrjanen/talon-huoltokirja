"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireHouseMember } from "@/lib/auth/require-house-member";
import { buildDocumentPath } from "@/lib/storage/document-path";
import { DOCUMENTS_BUCKET } from "@/lib/config/storage";

export async function uploadDocument(formData: FormData) {
  const houseId = String(formData.get("houseId") ?? "");
  const systemIdValue = formData.get("systemId");
  const itemIdValue = formData.get("itemId");

  const systemId =
    typeof systemIdValue === "string" && systemIdValue.length > 0
      ? systemIdValue
      : null;

  const itemId =
    typeof itemIdValue === "string" && itemIdValue.length > 0
      ? itemIdValue
      : null;

  const file = formData.get("file");

  if (!houseId || !(file instanceof File)) {
    return { error: "Puuttuvat tiedot." };
  }

  await requireHouseMember(houseId);

  const supabase = await createClient();

  if (systemId) {
    const { data: system } = await supabase
      .from("systems")
      .select("id, house_id")
      .eq("id", systemId)
      .eq("house_id", houseId)
      .maybeSingle();

    if (!system) {
      return { error: "Järjestelmää ei löytynyt." };
    }
  }

  if (itemId) {
    const { data: item } = await supabase
      .from("items")
      .select("id, house_id")
      .eq("id", itemId)
      .eq("house_id", houseId)
      .maybeSingle();

    if (!item) {
      return { error: "Irtaimistoa ei löytynyt." };
    }
  }

  const storagePath = buildDocumentPath({
    houseId,
    systemId,
    itemId,
    fileName: file.name,
  });

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("uploadDocument uploadError", uploadError);
    return { error: "Tiedoston tallennus epäonnistui." };
  }

  const { error: insertError } = await supabase
    .from("documents")
    .insert({
      house_id: houseId,
      system_id: systemId,
      item_id: itemId,
      title: file.name,
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.type || null,
      file_size: file.size,
    });

  if (insertError) {
    console.error("uploadDocument insertError", insertError);
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);
    return { error: "Dokumentin tietojen tallennus epäonnistui." };
  }

  revalidatePath(`/houses/${houseId}`);
  revalidatePath(`/houses/${houseId}/documents`);

  if (systemId) {
    revalidatePath(`/houses/${houseId}/systems/${systemId}`);
    revalidatePath(`/houses/${houseId}/systems/${systemId}/documents`);
  }

  if (itemId) {
    revalidatePath(`/houses/${houseId}/items`);
    revalidatePath(`/houses/${houseId}/items/${itemId}`);
    revalidatePath(`/houses/${houseId}/items/${itemId}/documents`);
  }

  return { success: "Dokumentti ladattu." };
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient();

  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select("id, house_id, system_id, item_id, storage_path")
    .eq("id", documentId)
    .maybeSingle();

  if (fetchError || !document) {
    return { error: "Dokumenttia ei löytynyt." };
  }

  await requireHouseMember(document.house_id);

  const { error: deleteDbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (deleteDbError) {
    console.error("deleteDocument deleteDbError", deleteDbError);
    return { error: "Dokumentin poisto epäonnistui." };
  }

  await supabase.storage.from(DOCUMENTS_BUCKET).remove([document.storage_path]);

  revalidatePath(`/houses/${document.house_id}`);
  revalidatePath(`/houses/${document.house_id}/documents`);

  if (document.system_id) {
    revalidatePath(`/houses/${document.house_id}/systems/${document.system_id}`);
    revalidatePath(`/houses/${document.house_id}/systems/${document.system_id}/documents`);
  }

  if (document.item_id) {
    revalidatePath(`/houses/${document.house_id}/items`);
    revalidatePath(`/houses/${document.house_id}/items/${document.item_id}`);
    revalidatePath(`/houses/${document.house_id}/items/${document.item_id}/documents`);
  }

  return { success: "Dokumentti poistettu." };
}

export async function uploadHouseDocumentAction(
  houseId: string,
  _unused: string | null,
  formData: FormData
) {
  formData.set("houseId", houseId);
  return uploadDocument(formData);
}

export async function uploadSystemDocumentAction(
  houseId: string,
  systemId: string,
  formData: FormData
) {
  formData.set("houseId", houseId);
  formData.set("systemId", systemId);
  return uploadDocument(formData);
}

export async function uploadItemDocumentAction(
  houseId: string,
  itemId: string,
  formData: FormData
) {
  formData.set("houseId", houseId);
  formData.set("itemId", itemId);
  return uploadDocument(formData);
}
