import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Besys Support Portal",
  description: "Help Desk Management System",
export const metadata: Metadata = {
  title: "BESYS Support | Client Ticket Portal",
  description: "A polished public landing page for BESYS Technologies PLC clients to log in and submit support tickets.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  title: "HDMS Pro — Help Desk Management System",
  description:
    "Enterprise-grade support ticket management for BESYS Technologies. Track, assign, and resolve issues with real-time dashboards and reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#F4F7F6] text-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}