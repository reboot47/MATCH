"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { HiMicrophone, HiPhone, HiPhoneOutgoing, HiVideoCamera, HiGift } from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOff } from 'react-icons/bs';
import { BiMessageDetail } from 'react-icons/bi';
import { IoMdWarning, IoMdInformation, IoMdSpeedometer, IoMdAlert, IoMdWifi, IoMdMic, IoMdMicOff, IoMdRefresh, IoMdCheckmarkCircle } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import GiftSelector from '@/app/components/video-call/GiftSelector';
import ChatPanel from '@/app/components/video-call/ChatPanel';
import VideoCallControls from '@/app/components/video-call/VideoCallControls';
import VideoCallTimer from '@/app/components/video-call/VideoCallTimer';
import { toast } from 'react-toastify';

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
  
  // ネットワーク品質状態
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');
  const [isLowQualityMode, setIsLowQualityMode] = useState<boolean>(false);
  const [isAutoQualityEnabled, setIsAutoQualityEnabled] = useState<boolean>(true);
  const [isRecoveryInProgress, setIsRecoveryInProgress] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [mediaError, setMediaError] = useState<string>('');

  // UI状態
  const [showGiftSelector, setShowGiftSelector] = useState<boolean>(false);
  const [showChatPanel, setShowChatPanel] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(100);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  // ネットワーク品質関連状態
  // 注：これらの状態は上部ですでに宣言されています
  
  // 接続要素参照
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // ギフトアニメーション状態
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [currentGift, setCurrentGift] = useState<string | null>(null);
  
  // ギフト設定
  const giftMapping = {
    heart: { name: 'ハート', points: 5, animation: 'floating', color: 'pink', icon: '❤️' },
    flower: { name: 'フラワー', points: 10, animation: 'rotating', color: 'green', icon: '🌸' },
    crown: { name: 'クラウン', points: 25, animation: 'shining', color: 'gold', icon: '👑' },
    diamond: { name: 'ダイヤモンド', points: 50, animation: 'exploding', color: 'blue', icon: '💎' },
    star: { name: 'スター', points: 30, animation: 'twinkling', color: 'yellow', icon: '⭐' },
    cake: { name: 'ケーキ', points: 20, animation: 'rising', color: 'pink', icon: '🎂' },
    rocket: { name: 'ロケット', points: 40, animation: 'flying', color: 'red', icon: '🚀' },
    fire: { name: 'ファイヤー', points: 15, animation: 'burning', color: 'orange', icon: '🔥' },
    rainbow: { name: 'レインボー', points: 60, animation: 'rainbow', color: 'purple', icon: '🌈' },
    kiss: { name: 'キス', points: 35, animation: 'pulsing', color: 'red', icon: '💋' }
  };

  // 初期化
  useEffect(() => {
    // 一時的にユーザー認証チェックを無効化
    // FIXME: 実際の運用時は下記のコードを有効化
    /*
    if (!userContext.user) {
      router.push('/login');
      return;
    }
    */
    
    // ユーザーがログインしていない場合でもデモモードで進行
    if (!userContext.user) {
      console.log('デモモード: ユーザー認証なしでビデオ通話機能を初期化');
      // トースト通知を表示
      toast.info('デモモード: 認証なしでビデオ通話を開始します', {
        position: 'top-center',
        autoClose: 3000
      });
    }
    
    initializeCall();
    
    return () => {
      // クリーンアップ - リダイレクトは行わない
      cleanupMediaStreams();
    };
  }, []);
  
  // ネットワーク品質モニタリング
  useEffect(() => {
    let qualityCheckInterval: NodeJS.Timeout | null = null;
    
    if (isConnected) {
      // 初期状態を通知
      toast.info('ネットワーク品質をモニタリングしています', {
        position: "top-center",
        autoClose: 3000,
      });
      
      const checkNetworkQuality = async () => {
        try {
          // ネットワーク状態を確認
          if ('connection' in navigator && navigator.connection) {
            // Network Information APIの型定義
            const connection = navigator.connection as {
              effectiveType?: string;
              downlink?: number;
            };
            const effectiveType = connection.effectiveType || 'unknown';
            const downlink = connection.downlink || 0; // Mbps
            
            let newQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
              newQuality = 'poor';
            } else if (effectiveType === '3g' || downlink < 1.5) {
              newQuality = 'fair';
            } else if (downlink < 5) {
              newQuality = 'good';
            }
            
            // 品質状態が変わった場合のみ処理
            if (newQuality !== networkQuality) {
              setNetworkQuality(newQuality);
              
              if (newQuality === 'poor' && !isRecoveryInProgress) {
                toast.warning('ネットワーク品質が低下しています', {
                  position: "top-center",
                  autoClose: 5000,
                });
                
                if (isAutoQualityEnabled && !isLowQualityMode) {
                  // 自動的に低品質モードに切り替え
                  setIsLowQualityMode(true);
                  toast.info('低品質モードに切り替えました', {
                    position: "top-center",
                    autoClose: 5000,
                  });
                }
              } else if ((newQuality === 'good' || newQuality === 'excellent') && isLowQualityMode && isAutoQualityEnabled) {
                // 自動的に通常品質モードに戻す
                setIsLowQualityMode(false);
                toast.success('通常品質モードに戻しました', {
                  position: "top-center",
                  autoClose: 5000,
                });
              }
            }
          }
        } catch (error) {
          console.error('Network quality check failed:', error);
        }
      };
      
      // 5秒ごとにネットワーク品質をチェック
      qualityCheckInterval = setInterval(checkNetworkQuality, 5000);
      
      // 初回チェック
      checkNetworkQuality();
    }
    
    return () => {
      if (qualityCheckInterval) {
        clearInterval(qualityCheckInterval);
      }
    };
  }, [isConnected, networkQuality, isLowQualityMode, isAutoQualityEnabled, isRecoveryInProgress]);
  
  // タイマー設定
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (isConnected) {
      timerId = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isConnected]);
  
  // オーディオレベルモニタリング
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let audioLevelInterval: NodeJS.Timeout | null = null;
    
    if (localStream && !isMuted) {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        microphone = audioContext.createMediaStreamSource(localStream);
        microphone.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // 100ミリ秒ごとにオーディオレベルをチェック
        audioLevelInterval = setInterval(() => {
          if (analyser) {
            analyser.getByteFrequencyData(dataArray);
            // 平均音量を計算
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            // 0から100の範囲に正規化
            const normalizedLevel = Math.min(100, Math.max(0, average / 256 * 100));
            setAudioLevel(normalizedLevel);
          }
        }, 100);
      } catch (error) {
        console.error('オーディオレベルモニタリングの初期化に失敗しました:', error);
      }
    }
    
    return () => {
      if (audioLevelInterval) {
        clearInterval(audioLevelInterval);
      }
      if (microphone) {
        microphone.disconnect();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [localStream, isMuted]);
  
  // メディアストリーム初期化
  const initializeCall = async () => {
    try {
      // ユーザーのカメラとマイクへのアクセス
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      // ローカルビデオの表示
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // 接続状態を更新
      setTimeout(() => {
        setIsConnected(true);
        
        // サンプル用の疑似リモートストリーム（実際のアプリでは通信相手のストリーム）
        const fakeRemoteStream = stream.clone();
        setRemoteStream(fakeRemoteStream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = fakeRemoteStream;
        }
      }, 1500);
        
    } catch (err) {
      console.error('メディアデバイスにアクセスできませんでした:', err);
      toast.error('カメラまたはマイクにアクセスできませんでした。');
    }
  };
  
  // マイクのミュート切替
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // カメラのオン/オフ切替
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  // メディアストリームクリーンアップ（リダイレクトなし）
  const cleanupMediaStreams = () => {
    // ローカルストリームの停止
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // リモートストリームの停止
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    
    // 接続状態をリセット
    setIsConnected(false);
  };
  
  // 通話終了と退出（リダイレクトあり）
  const hangupCall = () => {
    // ストリームクリーンアップ
    cleanupMediaStreams();
    
    // 通知とリダイレクト
    toast.success('通話を終了しました');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };
  
  // ギフト送信処理
  const handleSendGift = (giftType: string) => {
    const gift = giftMapping[giftType as keyof typeof giftMapping];
    
    if (!gift) {
      toast.error('選択されたギフトが見つかりません');
      return;
    }
    
    // ポイント消費処理
    if (userPoints >= gift.points) {
      // ポイント減算
      setUserPoints(prevPoints => prevPoints - gift.points);
      
      // ギフトアニメーション表示
      setCurrentGift(giftType);
      setShowGiftAnimation(true);
      
      // アニメーション終了後に状態をリセット
      setTimeout(() => {
        setShowGiftAnimation(false);
        setCurrentGift(null);
      }, 3000);
      
      // ギフト送信の通知
      toast.success(`${gift.name}を送りました！`);
    } else {
      toast.error('ポイントが足りません');
    }
  };

  // アニメーションスタイルの決定
  const determineAnimationClass = (giftType: string | null): string => {
    if (!giftType) return '';
    const gift = giftMapping[giftType as keyof typeof giftMapping];
    return gift ? gift.animation : '';
  };
  
  // ギフトの色の決定
  const determineGiftColor = (giftType: string | null): string => {
    if (!giftType) return '';
    const gift = giftMapping[giftType as keyof typeof giftMapping];
    return gift ? gift.color : '';
  };
  
  // ギフトのアイコン決定
  const determineGiftIcon = (giftType: string | null): string => {
    if (!giftType) return '';
    const gift = giftMapping[giftType as keyof typeof giftMapping];
    return gift ? gift.icon : '';
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 relative">
      {/* 通話画面 */}
      <div className="flex flex-col md:flex-row h-full w-full p-4 relative">
        {/* リモートビデオ（相手） */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>接続中...</p>
              </div>
            </div>
          )}
          
          {/* 通話時間表示 */}
          {isConnected && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-lg">
              <VideoCallTimer seconds={callDuration} />
            </div>
          )}
          
          {/* ギフトアニメーション */}
          <AnimatePresence>
            {showGiftAnimation && currentGift && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.7, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div 
                  className={`text-8xl ${determineAnimationClass(currentGift)}`}
                  style={{ color: determineGiftColor(currentGift) }}
                >
                  {determineGiftIcon(currentGift)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* ローカルビデオ（自分） */}
        <div className="absolute bottom-24 right-4 w-1/4 h-1/4 md:w-1/5 md:h-1/5 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              <p className="text-sm">カメラオフ</p>
            </div>
          )}
        </div>
      </div>
      
      {/* コントロールパネル */}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-80 p-4">
        <div className="flex justify-center space-x-8">
          <button
            onClick={toggleMute}
            className="flex flex-col items-center text-white relative"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              {isMuted ? <BsMicMuteFill size={24} /> : <HiMicrophone size={24} />}
              {!isMuted && (
                <div className="absolute -top-1 -right-1 w-14 h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${audioLevel > 50 ? 'bg-green-500' : audioLevel > 20 ? 'bg-green-300' : 'bg-green-200'} transition-all duration-100`}
                    style={{ width: `${audioLevel}%` }}
                  ></div>
                </div>
              )}
            </div>
            <span className="text-xs mt-1">{isMuted ? 'ミュート解除' : 'ミュート'}</span>
          </button>
          
          <button
            onClick={toggleVideo}
            className="flex flex-col items-center text-white"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              {isVideoOff ? <BsCameraVideoOff size={24} /> : <HiVideoCamera size={24} />}
            </div>
            <span className="text-xs mt-1">{isVideoOff ? 'カメラオン' : 'カメラオフ'}</span>
          </button>
          
          <button
            onClick={() => setShowGiftSelector(true)}
            className="flex flex-col items-center text-white"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <HiGift size={24} />
            </div>
            <span className="text-xs mt-1">ギフト</span>
          </button>
          
          <button
            onClick={() => setShowChatPanel(true)}
            className="flex flex-col items-center text-white"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <BiMessageDetail size={24} />
            </div>
            <span className="text-xs mt-1">チャット</span>
          </button>
          
          <button
            onClick={hangupCall}
            className="flex flex-col items-center text-white"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
              <HiPhone size={24} />
            </div>
            <span className="text-xs mt-1">通話終了</span>
          </button>
          
          {/* ネットワーク品質インジケーター */}
          <div className="flex flex-col items-center text-white">
            <div className={`w-12 h-12 rounded-full ${networkQuality === 'excellent' ? 'bg-green-600' : networkQuality === 'good' ? 'bg-green-500' : networkQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'} flex items-center justify-center`}>
              <IoMdWifi size={24} />
            </div>
            <span className="text-xs mt-1">
              {networkQuality === 'excellent' && '最高品質'}
              {networkQuality === 'good' && '良好'}
              {networkQuality === 'fair' && '普通'}
              {networkQuality === 'poor' && '不安定'}
            </span>
          </div>
          
          {/* 低品質モード切替ボタン - ネットワーク品質が不安定な時のみ表示 */}
          {networkQuality === 'poor' && (
            <div className="flex flex-col items-center text-white">
              <button 
                onClick={() => setIsAutoQualityEnabled(!isAutoQualityEnabled)} 
                className={`w-12 h-12 rounded-full ${isAutoQualityEnabled ? 'bg-blue-600' : 'bg-gray-700'} flex items-center justify-center`}
              >
                <IoMdRefresh size={24} />
              </button>
              <span className="text-xs mt-1">
                {isAutoQualityEnabled ? '自動調整ON' : '自動調整OFF'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* ギフトセレクター */}
      <AnimatePresence>
        {showGiftSelector && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl z-10"
            style={{ height: '70vh' }}
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-y-0 right-0 w-full md:w-96 bg-white z-10"
          >
            {/* ChatPanelコンポーネントに必要なプロパティを渡す */}
            <ChatPanel chatId={callId} onClose={() => setShowChatPanel(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ポイント表示 */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full flex items-center">
        <span className="text-yellow-400 mr-1">💰</span>
        <span>{userPoints}</span>
      </div>
    </div>
  );
};

export default VideoCallPageClient;
