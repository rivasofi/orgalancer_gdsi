import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orgalancer",
  description: "Plataforma para freelancers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}