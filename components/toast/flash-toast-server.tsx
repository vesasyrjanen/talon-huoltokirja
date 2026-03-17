import { cookies } from "next/headers";
import { FlashToast } from "@/components/toast/flash-toast";

type FlashPayload = {
  message: string;
  type: "success" | "error" | "info";
  ts?: number;
};

export async function FlashToastServer() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("flash")?.value;

  let parsed: FlashPayload | null = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  return <FlashToast initialFlash={parsed} />;
}
