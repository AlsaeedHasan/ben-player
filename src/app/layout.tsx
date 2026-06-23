import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BenPlayer - Ultimate Video Experience",
  description: "High-performance video wrapper built from scratch by Alsaeed",
  referrer: "no-referrer-when-downgrade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#020202] text-zinc-100">{children}</body>
    </html>
  );
}
