import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Clean",
  description: "Produk pembersih kendaraan terbaik untuk menjaga kebersihan dan kilau kendaraan Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-w-full overflow-x-hidden`}
      >
        <div className="w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
