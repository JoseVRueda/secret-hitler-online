import type { Metadata } from "next";
import { Old_Standard_TT, Oswald, Special_Elite } from "next/font/google";
import { SocketProvider } from "@/providers/SocketProvider";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-elite",
  display: "swap",
});

const oldStandardTT = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-old-standard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Secret Hitler",
  description: "Juego de mesa social de intriga y engaño ambientado en la Alemania de entreguerras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${specialElite.variable} ${oldStandardTT.variable}`}
    >
      <SocketProvider />
      <body className="paper grain vignette font-body antialiased">{children}</body>
    </html>
  );
}
