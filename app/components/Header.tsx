"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiMenu } from "react-icons/hi";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // 未ログイン時のナビゲーション項目
  const publicNavItems = [
    { href: "/", label: "ホーム" },
    { href: "/features", label: "機能" },
    { href: "/pricing", label: "料金" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  // ログイン後のナビゲーション項目
  const privateNavItems = [
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/matches", label: "マッチング" },
    { href: "/messages", label: "メッセージ" },
  ];

  // 現在の認証状態に基づいてナビゲーション項目を選択
  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("ログアウトしました");
      router.push("/");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm py-3 fixed w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/images/linebuzz-logo.svg"
              alt="LINEBUZZ"
              width={140}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </div>
        </Link>

        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-[#66cdaa] font-medium"
                  : "text-gray-600 hover:text-[#66cdaa] transition-colors"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* デスクトップボタン（未ログイン時） */}
        {!isAuthenticated && (
          <div className="hidden md:flex space-x-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 text-[#66cdaa] font-medium border border-[#66cdaa] rounded-lg hover:bg-[#f0faf7] transition-colors"
            >
              ログイン
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 bg-[#66cdaa] text-white font-medium rounded-lg hover:bg-[#5bb799] transition-colors shadow-sm"
            >
              無料登録
            </button>
          </div>
        )}

        {/* ログイン後のユーザーメニュー（デスクトップ） */}
        {isAuthenticated && (
          <div className="hidden md:block relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-gray-700 hover:text-[#66cdaa] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#f0faf7] flex items-center justify-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <FaUser className="text-[#66cdaa]" />
                )}
              </div>
              <span className="font-medium">{session?.user?.name || "ユーザー"}</span>
            </button>

            {/* ドロップダウンメニュー */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                    <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#f0faf7] hover:text-[#66cdaa]">
                      <FaUser className="mr-2" />
                      <span>マイプロフィール</span>
                    </div>
                  </Link>
                  <Link href="/settings" onClick={() => setUserMenuOpen(false)}>
                    <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#f0faf7] hover:text-[#66cdaa]">
                      <FaCog className="mr-2" />
                      <span>設定</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-[#f0faf7] hover:text-[#66cdaa]"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>ログアウト</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* モバイルメニューボタン */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 ${
                      pathname === item.href
                        ? "text-[#66cdaa] font-medium"
                        : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* ログイン状態に応じたモバイルメニューの追加項目 */}
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="py-2 text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      マイプロフィール
                    </Link>
                    <Link
                      href="/settings"
                      className="py-2 text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      設定
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 text-gray-600 text-left"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="py-2 text-[#66cdaa] font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/register"
                      className="py-2 bg-[#66cdaa] text-white font-medium rounded-lg px-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      無料登録
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
