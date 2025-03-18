"use client";

import React from 'react';

interface VideoCallTimerProps {
  seconds: number;
}

const VideoCallTimer: React.FC<VideoCallTimerProps> = ({ seconds }) => {
  // 時間フォーマット (HH:MM:SS)
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    // 時間が0の場合は表示しない
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="inline-flex items-center space-x-1 text-white bg-black bg-opacity-30 px-2 py-1 rounded-full">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
      <span className="text-sm font-medium">{formatTime(seconds)}</span>
    </div>
  );
};

export default VideoCallTimer;
