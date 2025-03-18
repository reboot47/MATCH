"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { HiMicrophone, HiPhone, HiPhoneOutgoing, HiVideoCamera, HiGift } from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOff } from 'react-icons/bs';
import { BiMessageDetail } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import GiftSelector from '@/app/components/video-call/GiftSelector';
import ChatPanel from '@/app/components/video-call/ChatPanel';
import VideoCallControls from '@/app/components/video-call/VideoCallControls';
import VideoCallTimer from '@/app/components/video-call/VideoCallTimer';
import { toast } from 'react-hot-toast';

type VideoCallPageProps = {
  callId: string;
};

const VideoCallPageClient = ({ callId }: VideoCallPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const userContext = useUser();
  
  // メディアストリーム状態
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [remainingPoints, setRemainingPoints] = useState<number>(100); // 初期ポイント（実際の環境ではAPIから取得）
  const [showGiftSelector, setShowGiftSelector] = useState<boolean>(false);
  const [showChatPanel, setShowChatPanel] = useState<boolean>(false);
  
  // UIインタラクション状態
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [fullscreenUser, setFullscreenUser] = useState<'local' | 'remote' | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  // ギフト関連の状態
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [currentGift, setCurrentGift] = useState<any>(null);
  const [sentGifts, setSentGifts] = useState<any[]>([]);

  // refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // モックデータ（本番環境ではAPIから取得）
  const mockUser = {
    id: '123',
    name: 'テストユーザー',
    avatar: '/images/avatars/avatar-1.jpg',
  };
  
  // ダミーの相手ユーザー情報（本番環境ではAPIから取得）
  const remoteUser = {
    id: '456',
    name: '山田花子',
    avatar: '/images/avatars/avatar-2.jpg',
  };

  // ギフトマッピング
  const giftMapping = {
    heart: {
      name: 'ハート',
      points: 5,
      animation: 'floating',
      color: 'pink',
      icon: '❤️'
    },
    flower: {
      name: 'フラワー',
      points: 10,
      animation: 'rotating',
      color: 'purple',
      icon: '🌸'
    },
    crown: {
      name: 'クラウン',
      points: 25,
      animation: 'shining',
      color: 'gold',
      icon: '👑'
    },
    diamond: {
      name: 'ダイヤモンド',
      points: 50,
      animation: 'exploding',
      color: 'blue',
      icon: '💎'
    },
    star: {
      name: 'スター',
      points: 30,
      animation: 'twinkling',
      color: 'yellow',
      icon: '⭐'
    },
    cake: {
      name: 'ケーキ',
      points: 20,
      animation: 'rising',
      color: 'pink',
      icon: '🍰'
    },
    rocket: {
      name: 'ロケット',
      points: 40,
      animation: 'flying',
      color: 'red',
      icon: '🚀'
    },
    fire: {
      name: 'ファイヤー',
      points: 15,
      animation: 'burning',
      color: 'orange',
      icon: '🔥'
    },
    rainbow: {
      name: 'レインボー',
      points: 60,
      animation: 'rainbow',
      color: 'multicolor',
      icon: '🌈'
    },
    kiss: {
      name: 'キス',
      points: 35,
      animation: 'pulsing',
      color: 'red',
      icon: '💋'
    }
  };

  // マウント時に一度だけ実行
  useEffect(() => {
    // メディアデバイスへのアクセスを要求
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // 接続ステータスを更新
        setTimeout(() => {
          setCallStatus('connected');
          setIsConnected(true);
          
          // ダミーのリモートストリームをセットアップ（実際にはWebRTCで接続）
          startMockRemoteStream();
        }, 2000);
        
      } catch (err) {
        console.error('メディアデバイスにアクセスできませんでした:', err);
        toast.error('カメラまたはマイクにアクセスできませんでした。');
      }
    };
    
    const startMockRemoteStream = async () => {
      try {
        // 実際の環境ではWebRTCピアツーピア接続を使用
        // ここではモックとしてダミーの映像を使用
        const mockRemoteStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false // 音声はミュート
        });
        
        setRemoteStream(mockRemoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = mockRemoteStream;
        }
      } catch (err) {
        console.error('リモートストリームの設定に失敗しました:', err);
      }
    };
    
    startLocalStream();
    
    // コンポーネントのアンマウント時にメディアストリームをクリーンアップ
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // コントロールの表示/非表示を制御
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      resetControlsTimeout();
    };
    
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    };
    
    // 初期タイムアウトを設定
    resetControlsTimeout();
    
    // イベントリスナーを追加
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  // 通話時間のカウント
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      intervalId = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [callStatus]);
  
  // マイクのミュート切り替え
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // ビデオのオン/オフ切り替え
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  // 通話を終了
  const endCall = () => {
    // ストリームをクリーンアップ
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    
    setCallStatus('ended');
    setIsConnected(false);
    
    // リダイレクト
    toast.success('通話を終了しました');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };
  
  // ギフト送信ロジック
  const handleSendGift = (giftId: string) => {
    // giftId から対応するギフト情報を取得
    const giftType = giftId as keyof typeof giftMapping;
    const gift = giftMapping[giftType];
    
    if (!gift) {
      toast.error('選択されたギフトが見つかりません');
      return;
    }
    
    if (remainingPoints >= gift.points) {
      // ポイントを減らす
      setRemainingPoints(prev => prev - gift.points);
      
      // ギフトセレクターを閉じる
      setShowGiftSelector(false);
      
      // 現在のギフトを設定
      setCurrentGift({
        id: giftId,
        name: gift.name,
        ...gift
      });
      
      // ギフトアニメーションを表示
      setShowGiftAnimation(true);
      
      // ギフト履歴を更新
      setSentGifts(prev => {
        const newGifts = [...prev, {
          id: giftId,
          name: gift.name,
          icon: gift.icon,
          timestamp: new Date()
        }];
        
        // 最新5件のみ保持
        if (newGifts.length > 5) {
          return newGifts.slice(newGifts.length - 5);
        }
        return newGifts;
      });
      
      // 一定時間後にアニメーションを非表示
      setTimeout(() => {
        setShowGiftAnimation(false);
      }, 3000);
      
      // ギフト送信の通知
      toast.success(`${gift.name}を送りました！`);
    } else {
      toast.error('ポイントが足りません');
    }
  };

  // ギフトアニメーション用のバリアント
  const giftAnimationVariants = {
    hidden: { opacity: 0, scale: 0.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  // 特殊効果アニメーション用のバリアント
  const effectAnimationVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.7,  // 不透明度を下げてちかちかしないように
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.0,
        ease: "easeIn"
      }
    }
  };
  
  // 追加のアニメーションバリアント
  const floatingVariants = {
    initial: { y: 0 },
    animate: { 
      y: ["-10px", "10px", "-10px"],
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      }
    }
  };
  
  const rotatingVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        repeat: Infinity, 
        duration: 4,
        ease: "linear" 
      }
    }
  };
  
  const twinklingVariants = {
    initial: { opacity: 0.7, scale: 1 },
    animate: { 
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.2, 1],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut" 
      }
    }
  };
  
  const flyingVariants = {
    initial: { x: -50, y: 50 },
    animate: { 
      x: 50,
      y: -50,
      transition: { 
        repeat: Infinity, 
        repeatType: "mirror" as const,
        duration: 2,
        ease: "easeInOut" 
      }
    }
  };
  
  const pulsingVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden flex items-center justify-center" 
      onMouseMove={() => setIsControlsVisible(true)}>
      
      {/* リモートビデオ（相手） */}
      <div 
        className={`absolute inset-0 ${fullscreenUser === 'remote' ? 'z-20' : 'z-10'}`}
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted // デモ用にミュート
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* ローカルビデオ（自分） */}
      <div 
        className={`absolute ${
          fullscreenUser === 'local' 
            ? 'inset-0 z-20' 
            : 'bottom-20 right-4 w-1/4 max-w-[200px] aspect-video rounded-lg overflow-hidden z-30 shadow-lg'
        }`}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
        />
        {isVideoOff && (
          <div className="bg-gray-800 w-full h-full flex items-center justify-center">
            <BsCameraVideoOff size={30} className="text-white" />
          </div>
        )}
      </div>
      
      {/* 相手のユーザー情報 */}
      <div className="absolute top-4 left-4 flex items-center z-30">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
          <img 
            src={remoteUser.avatar} 
            alt={remoteUser.name} 
            className="w-10 h-10 rounded-full mr-2 border-2 border-white"
          />
          <div>
            <p className="text-white font-medium">{remoteUser.name}</p>
          </div>
        </div>
      </div>
      
      {/* 通話時間表示 */}
      <div className="absolute top-4 right-4 z-30">
        <VideoCallTimer seconds={callDuration} />
      </div>
      
      {/* 送信済みギフト履歴表示 */}
      <div className="absolute bottom-20 left-4 z-30 flex flex-col space-y-2">
        {sentGifts.map((gift, index) => (
          <div 
            key={index} 
            className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-white text-sm animate-fadeIn"
          >
            <span className="mr-1">{gift.icon}</span>
            <span>{gift.name}</span>
          </div>
        ))}
      </div>
      
      {/* ギフトアニメーション */}
      <AnimatePresence>
        {showGiftAnimation && currentGift && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={giftAnimationVariants}
              className={`text-9xl flex flex-col items-center justify-center`}
            >
              <motion.div
                variants={
                  currentGift.animation === 'floating' ? floatingVariants :
                  currentGift.animation === 'rotating' ? rotatingVariants :
                  currentGift.animation === 'twinkling' ? twinklingVariants :
                  currentGift.animation === 'flying' ? flyingVariants :
                  currentGift.animation === 'pulsing' ? pulsingVariants :
                  currentGift.animation === 'rising' ? floatingVariants :
                  currentGift.animation === 'burning' ? pulsingVariants :
                  currentGift.animation === 'rainbow' ? twinklingVariants :
                  {}
                }
                initial="initial"
                animate="animate"
                className={`transition-all duration-500 ease-in-out ${currentGift.color === 'multicolor' ? 'text-gradient-rainbow' : ''}`}
              >
                {currentGift.icon}
              </motion.div>
              
              {/* エフェクト要素（アニメーションに応じた追加エフェクト） */}
              {(currentGift.animation === 'exploding' || currentGift.animation === 'rainbow') && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={effectAnimationVariants}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-8xl text-yellow-400 opacity-70 transform scale-125">✨</div>
                </motion.div>
              )}
              
              {currentGift.animation === 'shining' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={effectAnimationVariants}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-6xl text-yellow-300 opacity-70 transform scale-110">✨</div>
                </motion.div>
              )}
              
              {currentGift.animation === 'burning' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={effectAnimationVariants}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-7xl text-orange-500 opacity-50 transform -translate-y-2">🔥</div>
                </motion.div>
              )}
              
              {currentGift.animation === 'flying' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={effectAnimationVariants}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-5xl text-blue-300 opacity-50 transform translate-y-10">☁️</div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* ギフトセレクター */}
      <AnimatePresence>
        {showGiftSelector && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md p-4 rounded-t-2xl"
          >
            <GiftSelector 
              onClose={() => setShowGiftSelector(false)} 
              onSelectGift={handleSendGift}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* チャットパネル */}
      <AnimatePresence>
        {showChatPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 z-50 w-80 bg-black/80 backdrop-blur-md"
          >
            <ChatPanel 
              onClose={() => setShowChatPanel(false)} 
              messages={messages}
              setMessages={setMessages}
              remoteUser={remoteUser}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 操作コントロール */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-6">
              {/* マイクボタン */}
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isMuted ? (
                  <BsMicMuteFill size={24} className="text-white" />
                ) : (
                  <HiMicrophone size={24} className="text-white" />
                )}
              </button>
              
              {/* ビデオボタン */}
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isVideoOff ? (
                  <BsCameraVideoOff size={24} className="text-white" />
                ) : (
                  <HiVideoCamera size={24} className="text-white" />
                )}
              </button>
              
              {/* 終了ボタン */}
              <button
                onClick={endCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
              >
                <HiPhone size={32} className="text-white transform rotate-135" />
              </button>
              
              {/* ギフトボタン */}
              <button
                onClick={() => setShowGiftSelector(true)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              >
                <HiGift size={24} className="text-white" />
              </button>
              
              {/* チャットボタン */}
              <button
                onClick={() => setShowChatPanel(true)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              >
                <BiMessageDetail size={24} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCallPageClient;
