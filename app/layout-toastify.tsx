import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Providers from "@/providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MissionProvider } from "./contexts/MissionContext";
import { BoostProvider } from "./contexts/BoostContext";
import { FavoritesProvider } from "./contexts/FavoritesProvider";

// Googleフォントの設定
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
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "LineBuzz - 日本最大のマッチングサービス",
  description:
    "LineBuzzは業界をリードするマッチングプラットフォームで、AIを活用した高度なマッチングと安全なコミュニケーション環境を提供します。",
  metadataBase: new URL('https://linebuzz.jp'),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://linebuzz.jp",
    siteName: "LineBuzz",
    title: "LineBuzz - 日本最大のマッチングサービス",
    description:
      "LineBuzzは業界をリードするマッチングプラットフォームで、AIを活用した高度なマッチングと安全なコミュニケーション環境を提供します。",
    images: [
      {
        url: "https://linebuzz.jp/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LineBuzz - 日本最大のマッチングサービス",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LineBuzz - 日本最大のマッチングサービス",
    description:
      "LineBuzzは業界をリードするマッチングプラットフォームで、AIを活用した高度なマッチングと安全なコミュニケーション環境を提供します。",
    images: ["https://linebuzz.jp/images/twitter-image.jpg"],
    creator: "@linebuzz_jp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
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
                      
                      {/* デバッグパネルはServerコンポーネントのレイアウトには配置せず、
                          必要な場合は個別のクライアントコンポーネント内で使用する */}
                    </div>
                  </FavoritesProvider>
                </BoostProvider>
              </MissionProvider>
            </NotificationProvider>
          </UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: '#363636',
              color: '#fff',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
