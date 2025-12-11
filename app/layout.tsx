import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
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
  title: "My Trip - 한국 관광지 정보 서비스",
  description: "한국관광공사 API를 활용한 전국 관광지 검색 및 정보 제공 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 환경변수 확인
  const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  console.log('NAVER_MAP_CLIENT_ID:', naverMapClientId);

  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <Script
            strategy="beforeInteractive"
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
          />
          <SyncUserProvider>
            <Navbar />
          {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
