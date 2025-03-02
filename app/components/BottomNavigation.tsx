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

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    {
      path: "/dashboard",
      icon: HiOutlineHome,
      activeIcon: HiHome,
      label: "ホーム"
    },
    {
      path: "/discover",
      icon: HiOutlineUserGroup,
      activeIcon: HiUserGroup,
      label: "発見"
    },
    {
      path: "/live",
      icon: HiOutlineVideoCamera,
      activeIcon: HiVideoCamera,
      label: "ライブ"
    },
    {
      path: "/messages",
      icon: HiOutlineChat,
      activeIcon: HiChat,
      label: "メッセージ"
    },
    {
      path: "/profile",
      icon: HiOutlineUser,
      activeIcon: HiUser,
      label: "プロフィール"
    }
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-t-xl z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <motion.button
              key={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ios-btn ${
                isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(item.path)}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.path === "/messages" && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-secondary-500 rounded-full"></span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-0 h-0.5 w-6 bg-primary-600 dark:bg-primary-400 rounded-full"
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
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </motion.div>
  );
}
