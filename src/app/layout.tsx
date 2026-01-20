import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ApolloWrapper } from "../lib/ApolloWrapper"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utamu Wetu | Organic Grocery Store",
  description: "The best way to stuff your wallet with healthy, organic vegetables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ApolloWrapper>
          {/* Persistent Navigation */}
          <Navbar />

          {/* Dynamic Page Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Persistent Footer */}
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}