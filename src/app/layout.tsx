import type { Metadata } from "next";
import { Orbitron, Poppins } from "next/font/google";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
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
  icons: {
    icon: "/pitcrew-logo.jpeg",
    shortcut: "/pitcrew-logo.jpeg",
    apple: "/pitcrew-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
