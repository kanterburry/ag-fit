import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import CoachWidget from "@/components/features/coach/CoachWidget";
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
  title: "Antigravity Fitness",
  description: "AI-Powered Hybrid Training Log",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20 bg-background text-foreground`}
        suppressHydrationWarning
      >
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        {/* CoachWidget removed to avoid duplicate functionality */}
      </body>
    </html>
  );
}
