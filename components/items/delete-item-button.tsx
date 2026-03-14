"use client";

import { useTransition } from "react";
import { deleteItem } from "@/actions/items";

export function DeleteItemButton({
  houseId,
  itemId,
}: {
  houseId: string;
  itemId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await deleteItem(formData);
        });
      }}
    >
      <input type="hidden" name="houseId" value={houseId} />
      <input type="hidden" name="itemId" value={itemId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!window.confirm("Haluatko varmasti poistaa irtaimiston?")) {
            e.preventDefault();
          }
        }}
        className="rounded-lg border px-4 py-2 text-sm"
      >
        {isPending ? "Poistetaan..." : "Poista"}
      </button>
    </form>
  );
}
