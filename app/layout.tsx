import type { Metadata } from "next";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bellini | Hornos Industriales",
  description: "Fabricación premium de hornos industriales. Precisión, durabilidad y eficiencia.",
  icons: {
    icon: "/images/assets/bellini_icono_fondo_negro%20-%20copia.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-industrial-black text-gray-100">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
