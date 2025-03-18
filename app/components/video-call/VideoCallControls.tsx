"use client";

import React from 'react';
import { HiMicrophone, HiPhone, HiVideoCamera, HiGift } from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOff } from 'react-icons/bs';
import { BiMessageDetail } from 'react-icons/bi';

interface VideoCallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleGiftSelector: () => void;
  onToggleChat: () => void;
}

const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleGiftSelector,
  onToggleChat
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 w-full" onClick={(e) => e.stopPropagation()}>
      {/* マイクボタン */}
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full ${isMuted ? 'bg-gray-600' : 'bg-gray-800'} text-white`}
      >
        {isMuted ? (
          <BsMicMuteFill className="text-xl" />
        ) : (
          <HiMicrophone className="text-xl" />
        )}
      </button>

      {/* ビデオボタン */}
      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full ${isVideoOff ? 'bg-gray-600' : 'bg-gray-800'} text-white`}
      >
        {isVideoOff ? (
          <BsCameraVideoOff className="text-xl" />
        ) : (
          <HiVideoCamera className="text-xl" />
        )}
      </button>

      {/* ギフトボタン */}
      <button
        onClick={onToggleGiftSelector}
        className="p-3 rounded-full bg-purple-600 text-white"
      >
        <HiGift className="text-xl" />
      </button>

      {/* チャットボタン */}
      <button
        onClick={onToggleChat}
        className="p-3 rounded-full bg-blue-600 text-white"
      >
        <BiMessageDetail className="text-xl" />
      </button>

      {/* 通話終了ボタン */}
      <button
        onClick={onEndCall}
        className="p-3 rounded-full bg-red-600 text-white"
      >
        <HiPhone className="text-xl transform rotate-135" />
      </button>
    </div>
  );
};

export default VideoCallControls;
