"use client";

import { useRef, useState, useTransition } from "react";
import { uploadDocument } from "@/actions/documents";

type DocumentUploadFormProps = {
  action?: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
  houseId?: string;
  systemId?: string;
  itemId?: string;
};

export function DocumentUploadForm({
  action,
  houseId,
  systemId,
  itemId,
}: DocumentUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
      action={(formData) => {
        startTransition(async () => {
          if (houseId) formData.set("houseId", houseId);
          if (systemId) formData.set("systemId", systemId);
          if (itemId) formData.set("itemId", itemId);

          const result = action
            ? await action(formData)
            : await uploadDocument(formData);

          if (result && "error" in result && result.error) {
            setMessage(result.error);
            return;
          }

          if (result && "success" in result && result.success) {
            setMessage(result.success);
          } else {
            setMessage("Dokumentti ladattu.");
          }

          formRef.current?.reset();
        });
      }}
    >
      {houseId ? <input type="hidden" name="houseId" value={houseId} /> : null}
      {systemId ? <input type="hidden" name="systemId" value={systemId} /> : null}
      {itemId ? <input type="hidden" name="itemId" value={itemId} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Valitse tiedosto</label>
        <input
          type="file"
          name="file"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {message ? (
        <p className="text-sm text-neutral-600">{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        {isPending ? "Ladataan..." : "Lataa dokumentti"}
      </button>
    </form>
  );
}
