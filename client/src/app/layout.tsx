import type { Metadata } from "next";
import { Germania_One, Montserrat } from "next/font/google";
import { SocketProvider } from "@/providers/SocketProvider";
import "./globals.css";

const germania = Germania_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-germania",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Secret Hitler",
  description:
    "Juego de mesa social de intriga y engaño ambientado en la Alemania de entreguerras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${germania.variable} ${montserrat.variable}`}>
      <body className="font-body antialiased">
        <SocketProvider />
        {children}
      </body>
    </html>
  );
}
