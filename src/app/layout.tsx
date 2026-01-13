import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SportsPicksPro - Expert Sports Picks & Analysis",
  description: "Get winning sports picks from expert analysts. Subscribe for daily picks across NFL, NBA, MLB, NHL and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-950 text-white min-h-screen font-sans">
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
