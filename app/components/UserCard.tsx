"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineHeart, HiOutlineX, HiLocationMarker, HiOutlineInformationCircle } from "react-icons/hi";
import LazyImage from "./LazyImage";

interface Photo {
  id: string;
  url: string;
  isProfile: boolean;
}

interface UserCardProps {
  user: {
    id: string;
    name: string;
    age?: number;
    bio?: string;
    location?: string;
    occupation?: string;
    photos: Photo[];
  };
  onLike: (userId: string) => void;
  onDislike: (userId: string) => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  
  const photos = user.photos.length > 0 ? user.photos : [{ id: "placeholder", url: "/images/placeholder.png", isProfile: true }];
  
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };
  
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (startX === 0) return;
    
    let currentX;
    if ("touches" in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diff = currentX - startX;
    setOffsetX(diff);
    
    if (diff > 50) {
      setDirection("right");
    } else if (diff < -50) {
      setDirection("left");
    } else {
      setDirection(null);
    }
  };
  
  const handleDragEnd = () => {
    if (direction === "right") {
      onLike(user.id);
    } else if (direction === "left") {
      onDislike(user.id);
    }
    
    setStartX(0);
    setOffsetX(0);
    setDirection(null);
  };
  
  const handlePhotoNavigation = (index: number) => {
    setCurrentPhotoIndex(index);
  };
  
  return (
    <motion.div
      className="relative max-w-sm w-full mx-auto h-[70vh] ios-card"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ 
        x: offsetX,
        rotate: offsetX * 0.05,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDrag={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {/* オーバーレイインジケーター */}
      <AnimatePresence>
        {direction === "right" && (
          <motion.div 
            className="absolute top-5 right-5 z-20 bg-green-500 text-white rounded-full px-4 py-1 text-lg font-bold"
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            animate={{ opacity: 0.9, scale: 1, rotate: -20 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            いいね!
          </motion.div>
        )}
        {direction === "left" && (
          <motion.div 
            className="absolute top-5 left-5 z-20 bg-red-500 text-white rounded-full px-4 py-1 text-lg font-bold"
            initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 20 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            スキップ
          </motion.div>
        )}
      </AnimatePresence>

      {/* 写真表示領域 */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPhotoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <LazyImage 
              src={photos[currentPhotoIndex]?.url || "/images/placeholder.png"} 
              alt={`${user.name}の写真`} 
              width={500}
              height={800}
              objectFit="cover"
              className="w-full h-full"
              priority={currentPhotoIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* 写真インジケーター */}
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-10 h-1 rounded-full ${
                index === currentPhotoIndex ? "bg-white" : "bg-white/30"
              }`}
              onClick={() => handlePhotoNavigation(index)}
            />
          ))}
        </div>
        
        {/* 詳細情報オーバーレイ */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 z-10"
            >
              <h2 className="text-white text-2xl font-bold">
                {user.name}{user.age ? `, ${user.age}` : ""}
              </h2>
              
              {user.occupation && (
                <p className="text-white/90 text-base mt-1">{user.occupation}</p>
              )}
              
              {user.location && (
                <div className="flex items-center mt-1 text-white/80">
                  <HiLocationMarker className="w-4 h-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.bio && (
                <p className="text-white/90 text-base mt-4 line-clamp-3">
                  {user.bio}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* ユーザー情報バー */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6 flex justify-between items-end">
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {user.name}{user.age ? `, ${user.age}` : ""}
            </h2>
            {user.location && (
              <div className="flex items-center mt-1 text-white/80 text-sm">
                <HiLocationMarker className="w-4 h-4 mr-1" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="ios-btn rounded-full bg-white/20 p-2"
          >
            <HiOutlineInformationCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      {/* アクションボタン */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center items-center gap-6 py-4">
        <motion.button
          className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-red-500 ios-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDislike(user.id)}
        >
          <HiOutlineX className="w-8 h-8" />
        </motion.button>
        
        <motion.button
          className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-primary-500 ios-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onLike(user.id)}
        >
          <HiOutlineHeart className="w-8 h-8" />
        </motion.button>
      </div>
    </motion.div>
  );
}
