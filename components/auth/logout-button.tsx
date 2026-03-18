"use client";

import { useTransition } from "react";
import { logoutAction } from "@/actions/auth-logout";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => { await logoutAction(); })}
      style={{
        fontSize: 14,
        color: "#555",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      {isPending ? "Kirjaudutaan ulos..." : "Kirjaudu ulos"}
    </button>
  );
}
