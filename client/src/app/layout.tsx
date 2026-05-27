import { SocketProvider } from "@/providers/SocketProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <SocketProvider />
      <body>{children}</body>
    </html>
  );
}
