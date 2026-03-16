import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Talon huoltokirja",
  description: "Huoltokirja, dokumentit ja irtaimisto",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
