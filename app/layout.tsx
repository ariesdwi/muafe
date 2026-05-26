import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Professional Makeup Artist | Wedding, Engagement & Graduation Makeup",
  description:
    "Professional makeup service for wedding, engagement, graduation, photoshoot, and special events. Book your schedule easily via WhatsApp.",
  keywords: [
    "Makeup Artist Jakarta",
    "MUA Jakarta",
    "Jasa Makeup Wedding",
    "Makeup Wisuda",
    "Makeup Engagement",
    "Makeup Artist Profesional",
    "Wedding Makeup Artist",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${poppins.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
