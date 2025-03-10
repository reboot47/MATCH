import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Providers from "@/providers";
import { Toaster } from 'react-hot-toast';
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MissionProvider } from "./contexts/MissionContext";
import { BoostProvider } from "./contexts/BoostContext";
import { FavoritesProvider } from "./components/FavoritesContext";

// 日英両対応フォントの設定
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSerif = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

// viewportの設定を別のエクスポートに移動
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "LineBuzz - マッチングアプリ",
    template: "%s | LineBuzz",
  },
  description: "LineBuzz - 新しいマッチングの形を提供するアプリケーション",
  keywords: ["マッチング", "デート", "出会い", "パートナー", "恋愛", "アプリ"],
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "LineBuzz - マッチングアプリ",
    description: "LineBuzz - 新しいマッチングの形を提供するアプリケーション",
    siteName: "LineBuzz",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "LineBuzz - マッチングアプリ",
    description: "LineBuzz - 新しいマッチングの形を提供するアプリケーション",
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
        <Providers>
          <UserProvider>
            <NotificationProvider>
              <MissionProvider>
                <BoostProvider>
                  <FavoritesProvider>
                    <div className="mx-auto max-w-7xl">
                      {children}
                    </div>
                  </FavoritesProvider>
                </BoostProvider>
              </MissionProvider>
            </NotificationProvider>
          </UserProvider>
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              }
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              }
            }
          }} />
        </Providers>
      </body>
    </html>
  );
}
