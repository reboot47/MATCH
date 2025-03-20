"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { HiMicrophone, HiPhone, HiPhoneOutgoing, HiVideoCamera, HiGift } from 'react-icons/hi';
import { BsMicMuteFill, BsCameraVideoOff } from 'react-icons/bs';
import { IoMdWarning, IoMdInformation, IoMdSpeedometer, IoMdAlert, IoMdWifi, IoMdMic, IoMdMicOff, IoMdRefresh, IoMdCheckmarkCircle } from 'react-icons/io';
import { BiMessageDetail } from 'react-icons/bi';
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
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended' | 'failed'>('connecting');
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
  
  // メディアアクセス問題の記録
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  // ネットワーク品質状態
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  
  // ピンチズーム機能の状態管理
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  
  // オーディオレベルモニタリング
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 の値
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  
  // 低画質モード
  const [isLowQualityMode, setIsLowQualityMode] = useState(false);
  const [isAutoQualityEnabled, setIsAutoQualityEnabled] = useState(true);

  // refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // タッチイベント処理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 引数となる２点間の距離を計算
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastDistance(distance);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance !== null) {
      // 現在の２点間の距離を計算
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // 距離の変化に基づいてズームレベルを計算
      const delta = distance / lastDistance;
      const newScale = Math.max(1, Math.min(3, scale * delta));
      
      setScale(newScale);
      setLastDistance(distance);
    }
  };
  
  const handleTouchEnd = () => {
    setLastDistance(null);
  };
  
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
        // メディアデバイスにアクセス可能か事前チェック
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        
        if (!hasVideoInput || !hasAudioInput) {
          throw new Error('カメラまたはマイクが見つかりません');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        // オーディオレベルモニタリングの設定
        try {
          // AudioContextを作成
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;
          
          // オーディオ入力を取得
          const audioSource = audioContext.createMediaStreamSource(stream);
          
          // 分析用のAnalyserノードを作成
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.8; // レベル変化を滑らかに
          analyserRef.current = analyser;
          
          // オーディオソースを分析器に接続
          audioSource.connect(analyser);
          
          // データ配列の初期化
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          audioDataRef.current = dataArray;
          
          // オーディオレベルを定期的に取得
          const getAudioLevel = () => {
            if (analyserRef.current && audioDataRef.current && !isMuted) {
              analyserRef.current.getByteFrequencyData(audioDataRef.current);
              
              // 平均値を計算し、0-100のスケールに変換
              const average = Array.from(audioDataRef.current)
                .reduce((sum, value) => sum + value, 0) / audioDataRef.current.length;
              
              const normalizedLevel = Math.min(100, Math.max(0, Math.round(average / 256 * 100)));
              setAudioLevel(normalizedLevel);
            } else if (isMuted) {
              setAudioLevel(0);
            }
            
            // 定期的に呼び出す
            requestAnimationFrame(getAudioLevel);
          };
          
          // モニタリング開始
          getAudioLevel();
          
        } catch (err) {
          console.error('オーディオレベルモニタリングの設定に失敗しました:', err);
        }
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          
          // 映像が正しく表示されているか確認するためのイベントリスナー
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current.play()
              .then(() => {
                console.log('ローカルビデオの再生を開始しました');
              })
              .catch(error => {
                console.error('ローカルビデオの再生に失敗しました:', error);
                toast.error('ビデオの再生に問題が発生しました。ページをリロードしてください。');
              });
          };
        } else {
          console.error('localVideoRef.current が null です');
          toast.error('ビデオ要素の初期化に失敗しました。ページをリロードしてください。');
          return;
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
        toast.error('カメラまたはマイクにアクセスできませんでした。ブラウザの設定で許可してください。');
        
        // エラーメッセージを保存
        let errorMessage = 'カメラまたはマイクにアクセスできませんでした';
        
        if (err instanceof Error) {
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = 'カメラまたはマイクが見つかりませんでした。デバイスが接続されているか確認してください。';
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = 'カメラまたはマイクへのアクセスが拒否されました。ブラウザの設定で許可してください。';
          } else if (err.name === 'AbortError' || err.name === 'NotReadableError') {
            errorMessage = 'カメラまたはマイクにアクセスできませんでした。他のアプリが使用中かもしれません。';
          } else if (err.name === 'OverconstrainedError') {
            errorMessage = 'カメラの設定が制約されています。別の解像度や設定を試してください。';
          } else if (err.name === 'TypeError') {
            errorMessage = 'ブラウザがカメラやマイクをサポートしていない可能性があります。';
          }
        }
        
        setMediaError(errorMessage);
        
        // エラー状態を設定
        setCallStatus('failed');
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
          
          // 映像が正しく表示されているか確認するためのイベントリスナー
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play()
              .then(() => {
                console.log('リモートビデオの再生を開始しました');
              })
              .catch(error => {
                console.error('リモートビデオの再生に失敗しました:', error);
                toast.error('相手のビデオ表示に問題が発生しました。ページをリロードしてください。');
              });
          };
          
          // 無音状態を設定
          remoteVideoRef.current.muted = true;
        } else {
          console.error('remoteVideoRef.current が null です');
          toast.error('リモートビデオ要素の初期化に失敗しました。ページをリロードしてください。');
        }
      } catch (err) {
        console.error('リモートストリームの設定に失敗しました:', err);
        toast.error('接続に問題が発生しました。再試行してください。');
        // エラー状態を設定
        setCallStatus('failed');
        
        // 5秒後に自動的にホーム画面に戻る
        setTimeout(() => {
          endCall('connection_failed');
        }, 5000);
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
  
  // ネットワーク品質モニタリング
  useEffect(() => {
    if (callStatus !== 'connected') return;
    
    // ネットワーク状態追跡用変数
    let previousQuality = networkQuality;
    let poorQualityCount = 0;
    let continuousPoorQualityCount = 0; // 連続した低品質のカウント
    let recoveryAttemptCount = 0; // 自動回復試行回数
    
    // 実際のアプリではWebRTCのStatsAPIを使用して本当の品質を測定する
    // ここではシミュレーション実装
    const checkNetworkQuality = () => {
      // モバイルでの接続状態確認（Network Information API）
      // @ts-ignore - navigator.connection はTypeScriptの型定義にないかもしれない
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      let newQuality: 'excellent' | 'good' | 'fair' | 'poor';
      
      if (connection) {
        const effectiveType = connection.effectiveType; // 4g, 3g, 2g, slow-2g
        const downlink = connection.downlink; // Mbps
        
        if (effectiveType === '4g' && downlink > 5) {
          newQuality = 'excellent';
        } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 1)) {
          newQuality = 'good';
        } else if (effectiveType === '3g' || (effectiveType === '2g' && downlink > 0.5)) {
          newQuality = 'fair';
        } else {
          newQuality = 'poor';
        }
      } else {
        // ランダムシミュレーション（デモ用）
        const qualities = ['excellent', 'good', 'fair', 'poor'] as const;
        const randomIndex = Math.floor(Math.random() * qualities.length);
        newQuality = qualities[randomIndex];
      }
      
      // 品質が悪化した場合の警告と自動回復
      if (newQuality === 'poor') {
        // 連続した低品質のカウントを増やす
        continuousPoorQualityCount++;
        
        // 初回の警告のみ表示
        if (previousQuality !== 'poor') {
          toast.warning(
            <div className="flex items-center">
              <IoMdWarning className="text-yellow-500 mr-2" size={20} />
              <div>
                <p className="font-bold">ネットワーク品質が低下しています</p>
                <p className="text-xs">通話品質が悪化する可能性があります</p>
              </div>
            </div>
          );
          poorQualityCount++;
        }
        
        // 10秒間低品質が続く場合は低画質モードに自動切り替え
        if (continuousPoorQualityCount === 2 && !isLowQualityMode && isAutoQualityEnabled) {
          setIsLowQualityMode(true);
          toast.info(
            <div className="flex flex-col">
              <div className="flex items-center">
                <IoMdInformation className="text-blue-500 mr-2" size={20} />
                <p className="font-bold">低画質モードに切り替えました</p>
              </div>
              <p className="text-xs ml-7">安定した通話を維持するため、画質を下げています</p>
              <div className="flex justify-end mt-1">
                <button 
                  onClick={() => setIsAutoQualityEnabled(false)} 
                  className="text-xs py-0.5 px-2 bg-gray-200 text-gray-800 rounded mr-1"
                >
                  自動調整をオフにする
                </button>
              </div>
            </div>
          );
        }
        
        // 20秒間低品質が続く場合の処理
        if (continuousPoorQualityCount >= 4) {
          // 自動修復試行回数が2回未満の場合、自動リカバリーを試みる
          if (recoveryAttemptCount < 2) {
            toast.info(
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <IoMdRefresh className="text-blue-500 mr-2" size={20} />
                  <p className="font-bold">接続品質を回復しています...</p>
                </div>
                <div className="mt-1 ml-7 text-xs">ビデオ設定を最適化しています</div>
                <div className="w-full flex justify-end mt-1">
                  <div className="animate-pulse bg-blue-400 h-1 w-full rounded"></div>
                </div>
              </div>
            );
            
            // 自動リカバリー処理（実際の実装ではビデオビットレート下げなど）
            setTimeout(() => {
              // ランダムな成功/失敗シミュレーション
              const recoverySuccess = Math.random() > 0.3; // 70%の確率で成功
              
              if (recoverySuccess) {
                setNetworkQuality('good');
                // 低画質モードが有効なら無効に戻す
                if (isLowQualityMode && isAutoQualityEnabled) {
                  setIsLowQualityMode(false);
                  toast.success(
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <IoMdCheckmarkCircle className="text-green-500 mr-2" size={20} />
                        <p className="font-bold">接続品質が改善されました</p>
                      </div>
                      <p className="text-xs ml-7">通常品質に戻しました</p>
                    </div>
                  );
                } else {
                  toast.success(
                    <div className="flex items-center">
                      <IoMdCheckmarkCircle className="text-green-500 mr-2" size={20} />
                      <p className="font-bold">接続品質が改善されました</p>
                    </div>
                  );
                }
                continuousPoorQualityCount = 0;
              } else {
                recoveryAttemptCount++;
                // 2回目の失敗後、通話終了の提案を表示
                if (recoveryAttemptCount >= 2) {
                  toast.error(
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <IoMdAlert className="text-red-500 mr-2" size={20} />
                        <p className="font-bold">ネットワーク品質が極端に低下しています</p>
                      </div>
                      <p className="text-xs ml-7">通話を終了して再接続することをお勧めします</p>
                      <button 
                        onClick={() => endCall('network_error')} 
                        className="mt-2 bg-red-500 text-white text-xs py-1 px-2 rounded self-end"
                      >
                        通話を終了する
                      </button>
                    </div>
                  );
                }
              }
            }, 3000);
          } else if (continuousPoorQualityCount >= 6) { // 30秒以上続く場合は強い警告
            toast.error(
              <div className="flex flex-col">
                <p className="font-bold">ネットワーク品質が極端に低下しています</p>
                <p className="text-xs">通話を終了して再接続することをお勧めします</p>
                <button 
                  onClick={() => endCall('network_error')} 
                  className="mt-2 bg-red-500 text-white text-xs py-1 px-2 rounded self-end"
                >
                  通話を終了する
                </button>
              </div>
            );
            continuousPoorQualityCount = 0;
          }
        }
      } else {
        // 品質が改善された場合はカウンターをリセット
        continuousPoorQualityCount = 0;
      }
      
      // 長時間が続く場合、一度だけ通話リセットのヒントを表示
      if (poorQualityCount >= 3) {
        toast.info(
          <div className="flex items-center">
            <IoMdInformation className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="font-bold">通話を再開すると品質が改善するかもしれません</p>
            </div>
          </div>
        );
        poorQualityCount = 0; // リセットして繰り返し表示しない
      }
      
      previousQuality = newQuality;
      setNetworkQuality(newQuality);
    };
    
    const qualityInterval = setInterval(checkNetworkQuality, 5000);
    checkNetworkQuality(); // 初回実行
    
    return () => clearInterval(qualityInterval);
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
  const endCall = (reason?: string) => {
    // ストリームをクリーンアップ
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    
    setCallStatus('ended');
    setIsConnected(false);
    
    // 結果の記録と分析のために通話データを送信する（実装例）
    const callData = {
      callId,
      duration: callDuration,
      endReason: reason || 'user_ended',
      giftsExchanged: sentGifts.length,
      pointsSpent: sentGifts.reduce((total, gift) => {
        // gift.idからポイントを取得します
        const giftType = gift.id as keyof typeof giftMapping;
        return total + (giftMapping[giftType]?.points || 0);
      }, 0),
      networkQuality: { // ネットワーク品質の統計情報を収集する場所
        quality: networkQuality,
        timestamp: new Date().toISOString()
      }
    };
    
    // 実際の実装ではここでAPIを呼び出して通話データを送信
    console.log('Call data saved:', callData);
    
    // 通話終了理由に基づいたメッセージ
    const endMessage = reason === 'connection_lost' 
      ? '接続が切断されました' 
      : reason === 'network_error' 
        ? 'ネットワークエラーが発生しました' 
        : '通話を終了しました';
    
    // 終了理由に応じた通知タイプ
    if (reason === 'connection_lost' || reason === 'network_error') {
      toast.error(endMessage);
    } else {
      toast.success(endMessage);
    }
    
    // リダイレクト
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
        className={`absolute inset-0 ${fullscreenUser === 'remote' ? 'z-20' : 'z-10'} overflow-hidden`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          {/* ネットワーク品質に応じた画質調整のシミュレーション */}
          <div 
            className={`absolute inset-0 z-10 ${isLowQualityMode ? 'backdrop-blur-[2px]' : networkQuality === 'poor' ? 'backdrop-blur-sm' : networkQuality === 'fair' ? 'backdrop-blur-[0.5px]' : ''} ${networkQuality === 'poor' || isLowQualityMode ? 'bg-black/10' : ''} ${remoteStream ? '' : 'hidden'}`}
          ></div>
          
          {/* ズーム時のピンチ操作ガイド */}
          {scale > 1 && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm flex items-center">
              {scale.toFixed(1)}x ズーム中
            </div>
          )}
          
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted // デモ用にミュート
            className={`w-full h-full object-cover ${!remoteStream ? 'opacity-0' : ''} 
              ${isLowQualityMode ? 'saturate-50 contrast-75' : 
                networkQuality === 'poor' ? 'saturate-50' : 
                networkQuality === 'fair' ? 'saturate-75' : ''}`}
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'center',
              // 低画質モードの場合は解像度を下げる
              filter: isLowQualityMode ? 'blur(0.5px)' : 'none'
            }}
          />
          
          {/* ローディングインジケーター */}
          {(!remoteStream && callStatus === 'connecting') && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mb-3"></div>
                <p className="text-white text-sm font-medium">相手の映像を読み込み中...</p>
              </div>
            </div>
          )}
          
          {/* ネットワーク品質インジケーター（常時表示） */}
          {remoteStream && (
            <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1"
                 style={{
                   backgroundColor: networkQuality === 'excellent' ? 'rgba(34, 197, 94, 0.7)' : 
                                    networkQuality === 'good' ? 'rgba(34, 197, 94, 0.7)' : 
                                    networkQuality === 'fair' ? 'rgba(234, 179, 8, 0.7)' :
                                    'rgba(239, 68, 68, 0.7)',
                   color: 'white'
                 }}>
              {/* 品質に応じたアイコン表示 */}
              {networkQuality === 'excellent' || networkQuality === 'good' ? (
                <IoMdWifi className={networkQuality === 'excellent' ? 'animate-pulse' : ''} />
              ) : networkQuality === 'fair' ? (
                <IoMdWarning />
              ) : (
                <IoMdAlert className="animate-pulse" />
              )}
              
              {/* 品質レベル表示 */}
              <div className="flex gap-0.5">
                <div className={`h-2 w-1 rounded-sm ${networkQuality !== 'poor' ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`h-2 w-1 rounded-sm ${(networkQuality === 'good' || networkQuality === 'excellent') ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`h-2 w-1 rounded-sm ${networkQuality === 'excellent' ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
            </div>
          )}
          
          {/* 低品質警告通知 */}
          {(remoteStream && networkQuality === 'poor') && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-500/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm animate-pulse flex items-center">
              <IoMdWarning className="mr-1" />
              低速ネットワーク接続
            </div>
          )}
      </div>
      
      {/* ローカルビデオ（自分） */}
      <div 
        className={`absolute ${
          fullscreenUser === 'local' 
            ? 'inset-0 z-20' 
            : 'bottom-20 right-4 w-1/4 max-w-[200px] aspect-video rounded-lg overflow-hidden z-30 shadow-lg'
        }`}
      >
        <div className="relative w-full h-full">
          
          {/* オーディオレベルインジケーター */}
          {localStream && (
            <div className="absolute bottom-2 left-2 z-20 bg-black/40 rounded-full p-1.5 backdrop-blur-sm">
              <div className="relative w-5 h-5 flex items-center justify-center">
                {/* レベルアニメーション円 */}
                <div 
                  className={`absolute inset-0 rounded-full ${isMuted ? 'bg-gray-500/30' : 'bg-green-500/30'}`}
                  style={{
                    transform: `scale(${Math.max(0.6, audioLevel / 100 * 0.8 + 1)})`,
                    opacity: Math.max(0.3, audioLevel / 100),
                    transition: 'transform 100ms ease-out, opacity 100ms ease-out'
                  }}
                ></div>
                
                {/* マイクアイコン */}
                {isMuted ? (
                  <IoMdMicOff className="text-white text-xs" />
                ) : (
                  <IoMdMic className="text-white text-xs" />
                )}
              </div>
            </div>
          )}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''} ${!localStream ? 'opacity-0' : ''}`}
          />
          
          {/* ローディングインジケーター */}
          {(!localStream && callStatus === 'connecting' && !isVideoOff) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center">
                <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mb-2"></div>
                <p className="text-white text-xs">カメラ初期化中...</p>
              </div>
            </div>
          )}
          
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
        <div className="inline-flex items-center space-x-1 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {/* ネットワーク品質インジケーター */}
          <div className="flex items-center mr-2">
            <div className={`w-1 h-1.5 ${networkQuality !== 'poor' ? 'bg-green-500' : 'bg-gray-600'} rounded-sm mx-px`}></div>
            <div className={`w-1 h-2.5 ${networkQuality !== 'poor' && networkQuality !== 'fair' ? 'bg-green-500' : 'bg-gray-600'} rounded-sm mx-px`}></div>
            <div className={`w-1 h-3.5 ${networkQuality === 'excellent' ? 'bg-green-500' : 'bg-gray-600'} rounded-sm mx-px`}></div>
          </div>
          
          {/* 通話時間 */}
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <VideoCallTimer seconds={callDuration} />
        </div>
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
      
      {/* 通話ステータス表示 */}
      {callStatus !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
            {callStatus === 'connecting' && (
              <>
                <div className="animate-pulse mb-4 text-6xl">🔄</div>
                <h2 className="text-2xl font-bold text-white mb-2">接続中...</h2>
                <p className="text-gray-300 mb-4">カメラとマイクへのアクセスを許可してください</p>
                <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
              </>
            )}
            
            {callStatus === 'failed' && (
              <>
                <div className="mb-4 text-6xl">❌</div>
                <h2 className="text-2xl font-bold text-white mb-2">接続に失敗しました</h2>
                <p className="text-gray-300 mb-4">{mediaError || 'カメラまたはマイクへのアクセスが拒否されました'}</p>
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-bold text-white mb-2">解決策：</h3>
                  <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                    <li>ブラウザの設定でカメラとマイクへのアクセスを許可してください</li>
                    <li>別のアプリがカメラやマイクを使用している場合は終了してください</li>
                    <li>デバイスが正しく接続されているか確認してください</li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <p className="text-yellow-400 text-sm mb-2">自動的にホーム画面に戻ります...</p>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mb-4"></div>
                  
                  <div className="flex space-x-4 justify-center">
                    <button 
                      onClick={() => window.location.reload()}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    再試行する
                  </button>
                  <button 
                    onClick={() => router.push('/')}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    ホームに戻る
                  </button>
                </div>
              </>
            )}
            
            {callStatus === 'ended' && (
              <>
                <div className="mb-4 text-6xl">👋</div>
                <h2 className="text-2xl font-bold text-white mb-2">通話が終了しました</h2>
                <p className="text-gray-300 mb-6">またお会いしましょう！</p>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  ホームに戻る
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* ギフトセレクター */}
      <AnimatePresence>
        {showGiftSelector && callStatus === 'connected' && (
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
              
              {/* 低画質モード切替ボタン */}
              <button
                onClick={() => {
                  setIsLowQualityMode(!isLowQualityMode);
                  toast.info(
                    <div className="text-sm">
                      {isLowQualityMode ? '通常品質モードに切り替えました' : 'データ節約モードに切り替えました'}
                    </div>
                  );
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${isLowQualityMode ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                title={isLowQualityMode ? '通常品質に切り替え' : 'データ節約モードに切り替え'}
              >
                <IoMdSpeedometer size={24} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCallPageClient;
