"use client";

import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoVolumeMute, IoVolumeHigh } from 'react-icons/io5';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { FaPause, FaPlay } from 'react-icons/fa';
import Image from 'next/image';

export interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  username?: string;
  userImage?: string;
  videoCaption?: string;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  username,
  userImage,
  videoCaption
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // モバイルデバイスの検出
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':  // スペースキー
          togglePlay();
          e.preventDefault();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          skipForward();
          break;
        case 'ArrowLeft':
          skipBackward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // モーダルが開いている時はスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // モーダルが開いたら自動再生
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('自動再生できませんでした:', error);
        // 自動再生ポリシーにより自動再生できなかった場合はミュートして再生
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => {
            console.error('ミュート再生にも失敗しました:', e);
          });
        }
      });
    }
  }, [isOpen]);
  
  // 動画の再生状態が変更されたときの処理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleDurationChange = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('durationchange', handleDurationChange);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);
  
  // コントロールの表示/非表示を管理
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // 10秒スキップ
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      showControlsTemporarily();
    }
  };
  
  // 10秒戻る
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      showControlsTemporarily();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    showControlsTemporarily();
  };
  
  // シークバーをクリックした時の処理
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const seekPosition = (e.clientX - rect.left) / rect.width;
    
    if (videoRef.current && seekPosition >= 0 && seekPosition <= 1) {
      videoRef.current.currentTime = videoRef.current.duration * seekPosition;
    }
    showControlsTemporarily();
  };
  
  // タッチスワイプでのシーク操作
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    showControlsTemporarily();
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || !videoRef.current) return;
    
    const touchDiff = e.touches[0].clientX - touchStart;
    if (Math.abs(touchDiff) < 30) return; // 小さな移動は無視
    
    const seekAmount = (touchDiff / window.innerWidth) * videoRef.current.duration * 0.5;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seekAmount));
    
    setTouchStart(e.touches[0].clientX);
    showControlsTemporarily();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity"
      onClick={() => onClose()}
    >
      {/* モーダルコンテンツ */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={showControlsTemporarily}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setTouchStart(null)}
      >
        {/* ビデオプレーヤー */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          autoPlay
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
        
        {/* ユーザー情報 */}
        {username && (
          <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent text-white flex items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={userImage || '/images/placeholder.jpg'}
                alt={username}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold">{username}</p>
              {videoCaption && <p className="text-sm text-gray-300">{videoCaption}</p>}
            </div>
          </div>
        )}
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <IoClose size={24} />
        </button>
        
        {/* 再生/一時停止ボタン（中央） */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 rounded-full bg-black/30 hover:bg-black/50"
          >
            <FaPlay size={32} />
          </button>
        )}
        
        {/* コントロールバー */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* シークバー */}
          <div 
            className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-[#66cdaa] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* コントロールボタン */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={togglePlay} className="focus:outline-none">
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <button onClick={toggleMute} className="focus:outline-none">
                {isMuted ? <IoVolumeMute size={20} /> : <IoVolumeHigh size={20} />}
              </button>
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={toggleFullscreen} className="focus:outline-none">
                {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
