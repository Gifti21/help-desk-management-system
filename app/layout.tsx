import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
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
    </html>
  );
}