import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

import Header from "@/components/Header";
import GoToUp from "@/components/GoToUp";

export const metadata: Metadata = {
  title: "Aqil Frozen Food",
  description: "Retail Frozen Food skala Rumahan",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


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
        <GoToUp />
        <GoogleAnalytics gaId="G-SCHVWBMSZ0" />
      </body>
    </html>
  );
}
