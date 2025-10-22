import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // pesos que ficam bem visíveis
});

export const metadata: Metadata = {
  title: "Dashboard Vel Fibra",
  description: "Monitoramento de switches e retificadoras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
