import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/01_Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const tagesschrift = localFont({
  src: "./fonts/Tagesschrift-Regular.ttf",
});

export const comicRelief = localFont({
  src: "./fonts/ComicRelief-Regular.ttf",
});

export const poppins = Poppins({
  weight: "400",
});

export const tuffy = localFont({
  src: "./fonts/Tuffy-Regular.ttf",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aqil Frozen Food",
  description: "Hadirkan Kelezatan Beku ke Rumah Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
