"use client";

import { useEffect, useState } from "react";

type FlashPayload = {
  message: string;
  type: "success" | "error" | "info";
  ts?: number;
};

export function FlashToast({ initialFlash }: { initialFlash: FlashPayload | null }) {
  const [flash, setFlash] = useState<FlashPayload | null>(initialFlash);

  useEffect(() => {
    if (!flash) return;

    const timeout = setTimeout(() => {
      setFlash(null);
      fetch("/api/flash/clear", { method: "POST" }).catch(() => {});
    }, 3500);

    return () => clearTimeout(timeout);
  }, [flash]);

  if (!flash) return null;

  return (
    <div className={`flash-toast flash-${flash.type}`}>
      <div className="flash-toast-inner">
        <span>{flash.message}</span>
        <button
          type="button"
          className="flash-close"
          onClick={() => {
            setFlash(null);
            fetch("/api/flash/clear", { method: "POST" }).catch(() => {});
          }}
          aria-label="Sulje ilmoitus"
        >
          ×
        </button>
      </div>
    </div>
  );
}
