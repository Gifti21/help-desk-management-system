import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BESYS Support | Client Ticket Portal",
  description: "A polished public landing page for BESYS Technologies PLC clients to log in and submit support tickets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
