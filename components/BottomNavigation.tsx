"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { 
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineVideoCamera,
  HiOutlineChat,
  HiOutlineUser,
  HiOutlineHeart,
  HiHome,
  HiSearch,
  HiVideoCamera,
  HiChat,
  HiUser,
  HiHeart
} from "react-icons/hi";

export default function BottomNavigation() {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      label: "ホーム",
      path: "/dashboard",
      icon: HiOutlineHome,
      activeIcon: HiHome,
      key: "dashboard",
    },
    {
      label: "発見",
      path: "/discover",
      icon: HiOutlineSearch,
      activeIcon: HiSearch,
      key: "discover",
    },
    {
      label: "マッチング",
      path: "/match/discover",
      icon: HiOutlineHeart,
      activeIcon: HiHeart,
      key: "match",
    },
    {
      label: "メッセージ",
      path: "/messages",
      icon: HiOutlineChat,
      activeIcon: HiChat,
      key: "messages",
    },
    {
      label: "プロフィール",
      path: "/profile",
      icon: HiOutlineUser,
      activeIcon: HiUser,
      key: "profile",
    },
  ];

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-5 px-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.key}
              href={item.path}
              className="relative flex flex-col items-center justify-center py-2 ios-btn"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="navigation-indicator"
                    className="absolute inset-0 -m-1 bg-primary-50 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-6 h-6 relative z-10 ${
                    isActive
                      ? "text-primary-300"
                      : "text-gray-500"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive
                    ? "font-medium text-primary-300"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
