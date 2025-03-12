"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HiPlusCircle } from 'react-icons/hi';

const AppealVideoButton: React.FC = () => {
  // 追加ボタンをクリックしたときの動作
  const handleClick = () => {
    console.log('アピール動画追加ボタンがクリックされました');
    // 直接URLに移動する
    window.location.href = '/mypage/profile/edit/appeal-video/new';
  };

  return (
    <motion.div
      className="w-full border-2 border-dashed border-teal-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-teal-500 flex items-center mb-2">
        <HiPlusCircle size={24} />
        <span className="ml-2 font-medium">追加</span>
      </div>
      <p className="text-xs text-gray-500 text-center">
        実際であなたの魅力をもっと伝えましょう
      </p>
    </motion.div>
  );
};

export default AppealVideoButton;
