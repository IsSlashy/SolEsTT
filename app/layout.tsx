import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolEsTT - Decentralized Real Estate Platform",
  description: "Tokenized real estate investment and management on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-junot-cream-light`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Animated gold gradient blobs */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-junot-gold/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-junot-gold-light/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-junot-gold-pale/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>

          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-junot-cream-light via-junot-cream to-junot-gold-pale/20 animate-gradient bg-[length:400%_400%]"></div>

          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212, 175, 55) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <LanguageProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
