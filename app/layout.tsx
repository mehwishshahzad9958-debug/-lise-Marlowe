import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Élise Marlowe — Fashion Portfolio",
  description: "Editorial styling, runway looks and personal wardrobes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
