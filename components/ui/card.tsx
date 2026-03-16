import type { ReactNode } from "react";

export function Card({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return <div className={`ui-card${compact ? " compact" : ""}`}>{children}</div>;
}
