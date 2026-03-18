import "./globals.css";
import type { ReactNode } from "react";
import { FlashToastServer } from "@/components/toast/flash-toast-server";

export const metadata = {
  title: "Rakennusn huoltokirja",
  description: "Huoltokirja, dokumentit ja irtaimisto",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fi">
      <body>
        <FlashToastServer />
        {children}
      </body>
    </html>
  );
}
