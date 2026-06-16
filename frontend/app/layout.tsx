import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moviora AI",
  description: "A RAG-powered movie intelligence platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
