import type { Metadata } from "next";
import { Exo_2, Orbitron } from "next/font/google";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Pit Crew Mobile Auto Detailing",
    template: "%s | Pit Crew Mobile Auto Detailing",
  },
  description:
    "Premium mobile auto detailing with transparent service packages, multilingual support, and easy booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
