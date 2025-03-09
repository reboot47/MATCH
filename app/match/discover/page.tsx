'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/components/UserContext';
import MatchContainer from '@/components/match/MatchContainer';
import { 
  Filter, MapPin, Sliders, Loader2, 
  Zap, CheckCircle, AlertCircle
} from 'lucide-react';

export default function DiscoverPage() {
  const { points, isGenderMale } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void | null>(null);
  
  // コンポーネントがマウントされたことを確認
  useEffect(() => {
    console.log('ディスカバーページがマウントされました');
  }, []);

  // 初期ロードの模擬
  useEffect(() => {
    // コンポーネントのマウント時にローディング状態を設定
    let isMounted = true;
    
    // タイマーを設定
    const timer = setTimeout(() => {
      if (isMounted) {
        console.log('ローディング完了');
        setIsLoading(false);
      }
    }, 1000); // 1秒に短縮
    
    // 即時にロード状態を確認するためのバックアップタイマー
    const backupTimer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log('バックアップタイマーによるローディング完了');
        setIsLoading(false);
      }
    }, 2000);
    
    // クリーンアップ関数
    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(backupTimer);
    };
  }, [isLoading]);

  // ポイントの変更処理
  const handlePointsChange = (action: 'like' | 'superLike', amount: number, success: boolean) => {
    if (!success) {
      // ポイント不足の通知
      showNotificationWithTimeout('error', `ポイントが不足しています（必要: ${amount}ポイント）`);
      setShowConfirmation(true);
      setPendingAction(() => () => {
        // ポイント購入画面へのリダイレクト処理
        console.log('ポイント購入画面へリダイレクト');
        showNotificationWithTimeout('success', 'ポイント購入画面へ移動します');
      });
    } else {
      // ポイント消費成功
      const message = action === 'like' ? 'いいねを送信しました！' : 'スーパーライクを送信しました！';
      showNotificationWithTimeout('success', message);
      
      // ポイント残高の更新（実際にはAPIで処理）
      if (isGenderMale()) {
        const newBalance = (points?.balance || 0) - amount;
        // 実際のアプリでは、ここでAPI呼び出しをしてポイント残高を更新
      }
    }
  };
  
  // マッチング処理
  const handleMatch = (profileId: string) => {
    showNotificationWithTimeout('success', 'マッチングが成立しました！');
  };

  // 通知表示
  const showNotificationWithTimeout = (type: 'success' | 'error', message: string) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // ポイント消費確認アクション
  const confirmAction = () => {
    setShowConfirmation(false);
    if (pendingAction) {
      pendingAction();
    }
  };

  // ポイント消費キャンセル
  const cancelAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  return (
    <div className="max-w-md mx-auto pb-16 px-4 min-h-screen">
      {/* ヘッダー */}
      <header className="py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          whileTap={{ scale: 0.97 }}
        >
          <Zap className="text-primary mr-1" size={20} />
          <span className="font-semibold">{points?.balance || 0}</span>
          <span className="text-gray-500 text-sm ml-1">pts</span>
          {isGenderMale() && (
            <motion.button 
              className="ml-2 bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 flex items-center"
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1">チャージ</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </motion.div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white shadow-sm">
            <MapPin size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-white shadow-sm">
            <Filter size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-white shadow-sm">
            <Sliders size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mt-2">
        {isLoading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">プロフィールを読み込み中...</p>
            <div className="mt-4 w-full max-w-xs bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0 }}
                onAnimationComplete={() => {
                  console.log('プログレスバーアニメーション完了');
                  setIsLoading(false); // アニメーション完了時に強制的にローディング終了
                }}
              />
            </div>
            <button 
              className="mt-4 text-xs text-primary underline"
              onClick={() => setIsLoading(false)}
            >
              読み込みをスキップ
            </button>
          </div>
        ) : (
          <MatchContainer onMatch={handleMatch} onPointsChange={handlePointsChange} />
        )}
      </main>

      {/* 通知 */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 left-0 right-0 mx-auto w-5/6 max-w-sm p-3 rounded-lg shadow-lg flex items-center backdrop-blur-sm ${
              notificationType === 'success' ? 'bg-green-50/90 border border-green-200' : 'bg-red-50/90 border border-red-200'
            }`}
            layout
          >
            {notificationType === 'success' ? (
              <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
            )}
            <p className={`${notificationType === 'success' ? 'text-green-800' : 'text-red-800'} text-sm`}>
              {notificationMessage}
            </p>
            <motion.button 
              className="ml-auto p-1 rounded-full hover:bg-black/5"
              onClick={() => setShowNotification(false)}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ポイント消費確認モーダル */}
      {showConfirmation && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-5 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="mb-4 flex items-start">
              <div className="mr-3 mt-1 bg-red-100 rounded-full p-1.5">
                <AlertCircle className="text-red-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">ポイントが不足しています</h3>
                <p className="text-gray-600 text-sm mb-1">
                  この操作を行うにはポイントが足りません。ポイントを購入しますか？
                </p>
                {isGenderMale() && (
                  <div className="bg-neutral-100 rounded-lg p-2 mb-3 text-sm">
                    <p className="font-medium mb-1">おすすめプラン</p>
                    <div className="flex justify-between items-center">
                      <span>500ポイント</span>
                      <span className="font-bold">¥3,000</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
                onClick={cancelAction}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                onClick={confirmAction}
              >
                ポイントを購入
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
