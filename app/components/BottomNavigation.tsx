"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineChat, 
  HiOutlineVideoCamera, 
  HiOutlineUser,
  HiHome,
  HiUserGroup,
  HiChat,
  HiVideoCamera,
  HiUser
} from "react-icons/hi";
import { FaHeart, FaRegHeart, FaCalendarAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    {
      path: "/home",
      icon: HiOutlineHome,
      activeIcon: HiHome,
      label: "ホーム"
    },
    {
      path: "/discovery",
      icon: HiOutlineUserGroup,
      activeIcon: HiUserGroup,
      label: "発見"
    },
    {
      path: "/likes",
      icon: FaRegHeart,
      activeIcon: FaHeart,
      label: "お相手から",
      badge: 1 // 未読の「いいね」件数
    },
    {
      path: "/recruitment",
      icon: FaRegCalendarAlt,
      activeIcon: FaCalendarAlt,
      label: "募集",
      badge: 1 // 新着募集件数
    },
    {
      path: "/messages",
      icon: HiOutlineChat,
      activeIcon: HiChat,
      label: "メッセージ"
    },
    {
      path: "/mypage",
      icon: HiOutlineUser,
      activeIcon: HiUser,
      label: "マイページ"
    }
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-50 w-full max-w-screen-lg mx-auto"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex justify-around items-center h-16 px-2 w-full">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <motion.button
              key={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ios-btn ${
                isActive ? "text-primary-500" : "text-gray-600"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // ホームタブの場合は強制的にリロードして必ず新しいデータを表示する
                if (item.path === '/home' && pathname === '/home') {
                  console.log('ホームページを強制的に再読み込みします');
                  window.location.href = item.path;
                } else {
                  router.push(item.path);
                }
              }}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {(item.path === "/messages" || (item.path === "/likes" && item.badge)) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-0 h-0.5 w-6 bg-primary-500 rounded-full"
                  layoutId="bottomNav"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="h-safe-bottom bg-white" />
    </motion.div>
  );
}
