import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import { UserProvider } from "@/components/UserContext";

// 日英両対応フォントの設定
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "LINEBUZZ - 最高のマッチングアプリ",
  description: "洗練されたデザインとUXを持つ最高のマッチングアプリです。",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#ffffff",
  appleWebApp: {
    title: "LINEBUZZ",
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1668-2388.png",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1242-2688.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-828-1792.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans bg-white text-gray-900">
        <AuthProvider>
          <UserProvider>
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
