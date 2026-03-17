"use server";

import { cookies } from "next/headers";

export type FlashType = "success" | "error" | "info";

export async function setFlash(
  message: string,
  type: FlashType = "success"
) {
  const cookieStore = await cookies();

  cookieStore.set(
    "flash",
    JSON.stringify({
      message,
      type,
      ts: Date.now(),
    }),
    {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 20,
    }
  );
}
