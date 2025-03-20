import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Providers from "@/providers";
// import { Toaster } from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MissionProvider } from "./contexts/MissionContext";
import { BoostProvider } from "./contexts/BoostContext";
import { FavoritesProvider } from "./components/FavoritesContext";

// デバッグパネルコンポーネントは別のClient Componentとして実装し、デバッガーが必要な場合は
// 個別のページやクライアントコンポーネントからインポートする方針に変更

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
                      
                      {/* デバッグパネルはServerコンポーネントのレイアウトには配置せず、
                          必要な場合は個別のクライアントコンポーネント内で使用する */}
                    </div>
                  </FavoritesProvider>
                </BoostProvider>
              </MissionProvider>
            </NotificationProvider>
          </UserProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: 'rgba(30, 41, 59, 0.95)',
              color: '#fff',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              fontSize: '0.95rem',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}
            progressStyle={{
              background: 'linear-gradient(to right, #10b981, #3b82f6)'
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
