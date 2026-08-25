import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kamran Photo Studio — 4K Cinema, Drone & Editorial Photography",
  description:
    "Kamran Photo Studio crafts ultra HD 4K cinema, aerial drone visuals, and editorial photography for weddings, commercial work, and portraits.",
  keywords: [
    "photography studio",
    "4K cinema",
    "drone videography",
    "wedding photographer",
    "commercial photography",
  ],
  openGraph: {
    title: "Kamran Photo Studio",
    description:
      "Ultra HD 4K Cinema, Aerial Drone Visuals & Editorial Photography.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        className="antialiased bg-obsidian text-offwhite font-body"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}