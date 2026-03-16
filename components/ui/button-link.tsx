import Link from "next/link";
import type { ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  variant = "subtle",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "subtle";
}) {
  return (
    <Link href={href} className={`ui-button-link ${variant}`}>
      {children}
    </Link>
  );
}
