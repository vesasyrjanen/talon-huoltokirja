"use client";

import { useTransition } from "react";
import { deleteHouseAction } from "@/actions/houses-delete";

export function DeleteHouseButton({ houseId }: { houseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="ui-button-link"
      style={{
        background: "#ef4444",
        color: "white",
        borderColor: "#ef4444",
        cursor: isPending ? "default" : "pointer",
      }}
      disabled={isPending}
      onClick={() => {
        const ok = window.confirm(
          "Haluatko varmasti poistaa tämän rakennuksen? Kaikki siihen liittyvät järjestelmät, huollot, dokumentit ja irtaimisto poistuvat samalla."
        );

        if (!ok) return;

        startTransition(async () => {
          await deleteHouseAction(houseId);
        });
      }}
    >
      {isPending ? "Poistetaan..." : "Poista rakennus"}
    </button>
  );
}
