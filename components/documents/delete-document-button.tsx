"use client";

import { useTransition } from "react";
import { deleteDocument } from "@/actions/documents";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className="rounded-lg border px-3 py-2 text-sm"
      onClick={() => {
        const ok = window.confirm("Haluatko varmasti poistaa dokumentin?");
        if (!ok) return;

        startTransition(async () => {
          await deleteDocument(documentId);
        });
      }}
    >
      {isPending ? "Poistetaan..." : "Poista"}
    </button>
  );
}
