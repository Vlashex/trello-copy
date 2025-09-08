import type { Metadata } from "next";
import "@/shared/globals.css";

export const metadata: Metadata = {
  title: "Trello-copy",
  description: "Pet project created by Vlashex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
