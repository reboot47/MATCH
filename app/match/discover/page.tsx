'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserProfile } from '@/components/UserContext';
import ProfileCard from '@/components/profile/ProfileCard';
import { 
  Filter, MapPin, Sliders, Loader2, 
  Zap, CheckCircle, AlertCircle
} from 'lucide-react';

// モックプロフィールデータ
const MOCK_PROFILES: UserProfile[] = [
  {
    id: '1',
    name: '田中さくら',
    age: 25,
    gender: 'female',
    bio: '都内で看護師をしています。休日は料理とヨガを楽しんでいます。映画鑑賞も好きで、特に恋愛映画が大好きです。趣味が合う方とお話したいです。',
    location: '東京都',
    profileCompletionPercentage: 95,
    isVerified: true,
    interests: ['料理', 'ヨガ', '映画鑑賞', '旅行', 'カフェめぐり'],
    occupation: '看護師',
    education: '看護大学',
    isOnline: true,
  },
  {
    id: '2',
    name: '鈴木美咲',
    age: 27,
    gender: 'female',
    bio: 'マーケティング会社で働いています。休日は友達とショッピングや美味しいレストランを探すのが好きです。明るく前向きな性格です。',
    location: '神奈川県',
    profileCompletionPercentage: 90,
    isVerified: true,
    interests: ['ショッピング', 'グルメ', '読書', 'ワイン', '音楽'],
    occupation: 'マーケター',
    education: '早稲田大学',
    isOnline: false,
    lastActive: '1時間前',
  },
  {
    id: '3',
    name: '伊藤ゆかり',
    age: 23,
    gender: 'female',
    bio: '美容師です。ファッションやヘアスタイルに興味があります。ポジティブで話しやすい性格だと言われます。休日はカフェ巡りやショッピングが好きです。',
    location: '東京都',
    profileCompletionPercentage: 85,
    isVerified: false,
    interests: ['美容', 'ファッション', 'カフェ巡り', 'アート', '写真'],
    occupation: '美容師',
    isOnline: true,
  },
  {
    id: '4',
    name: '高橋愛',
    age: 29,
    gender: 'female',
    bio: 'IT企業でデザイナーをしています。休日は絵を描いたり、散歩したりするのが好きです。穏やかな性格で、静かな時間を大切にしています。',
    location: '東京都',
    profileCompletionPercentage: 92,
    isVerified: true,
    interests: ['デザイン', 'アート', '散歩', '写真撮影', '映画'],
    occupation: 'UI/UXデザイナー',
    education: '芸術大学',
    isOnline: false,
    lastActive: '3時間前',
  },
  {
    id: '5',
    name: '渡辺明日香',
    age: 26,
    gender: 'female',
    bio: '出版社で編集者として働いています。本を読むのが大好きで、特に推理小説にはまっています。カフェでゆっくり過ごすのも好きです。',
    location: '千葉県',
    profileCompletionPercentage: 88,
    isVerified: true,
    interests: ['読書', 'カフェ', '映画', '料理', '推理小説'],
    occupation: '編集者',
    education: '東京大学',
    isOnline: true,
  },
];

export default function DiscoverPage() {
  const { user, points, spendPoints, isGenderMale } = useUser();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void | null>(null);

  // 取得したプロフィールを設定
  useEffect(() => {
    // APIからデータを取得する代わりにモックデータを使用
    const fetchProfiles = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しをシミュレート
      setProfiles(MOCK_PROFILES);
      setIsLoading(false);
    };

    fetchProfiles();
  }, []);

  // 「いいね」ボタン処理
  const handleLike = async () => {
    // 男性ユーザーの場合、コストが発生
    if (isGenderMale()) {
      const likeCost = 5; // 「いいね」のコスト
      
      // ポイントが足りない場合
      if (points?.balance < likeCost) {
        showNotificationWithTimeout('error', 'ポイントが足りません。ポイントを購入してください。');
        return;
      }
      
      // ポイント消費確認
      setShowConfirmation(true);
      setPendingAction(() => async () => {
        const success = await spendPoints(likeCost, 'いいねの送信');
        if (success) {
          showNotificationWithTimeout('success', '「いいね」を送信しました！');
          nextProfile();
        } else {
          showNotificationWithTimeout('error', 'エラーが発生しました。もう一度お試しください。');
        }
      });
    } else {
      // 女性ユーザーの場合、無料
      showNotificationWithTimeout('success', '「いいね」を送信しました！');
      nextProfile();
    }
  };

  // 「スーパーいいね」ボタン処理
  const handleSuperLike = async () => {
    const superLikeCost = 50; // スーパーいいねのコスト
    
    // ポイントが足りない場合
    if (points?.balance < superLikeCost) {
      showNotificationWithTimeout('error', 'ポイントが足りません。ポイントを購入してください。');
      return;
    }
    
    // ポイント消費確認
    setShowConfirmation(true);
    setPendingAction(() => async () => {
      const success = await spendPoints(superLikeCost, 'スーパーいいねの送信');
      if (success) {
        showNotificationWithTimeout('success', 'スーパーいいね！を送信しました！相手に目立つように表示されます');
        nextProfile();
      } else {
        showNotificationWithTimeout('error', 'エラーが発生しました。もう一度お試しください。');
      }
    });
  };

  // スキップ処理
  const handleSkip = () => {
    nextProfile();
  };

  // 次のプロフィールへ移動
  const nextProfile = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
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
        <div className="flex items-center">
          <Zap className="text-primary mr-2" size={20} />
          <span className="font-semibold">{points?.balance || 0} pts</span>
        </div>
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
          <div className="h-[550px] flex flex-col items-center justify-center">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-gray-500">プロフィールを読み込み中...</p>
          </div>
        ) : profiles.length === 0 || currentIndex >= profiles.length ? (
          <div className="h-[550px] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Filter size={48} />
            </div>
            <h2 className="text-xl font-bold mb-2">新しいマッチングが見つかりません</h2>
            <p className="text-gray-500 mb-6">
              現在表示できるプロフィールがありません。検索条件を変更するか、後でもう一度お試しください。
            </p>
            <button 
              className="px-6 py-3 bg-primary text-white rounded-full font-medium"
              onClick={() => {
                setCurrentIndex(0);
                setProfiles(MOCK_PROFILES); // デモ用にリセット
              }}
            >
              検索条件を変更
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ProfileCard
                profile={profiles[currentIndex]}
                onLike={handleLike}
                onSkip={handleSkip}
                onSuperLike={handleSuperLike}
                costLike={isGenderMale() ? 5 : 0}
                costSuperLike={50}
                currentIndex={currentIndex + 1}
                totalCards={profiles.length}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* 通知 */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 left-0 right-0 mx-auto w-5/6 max-w-sm p-3 rounded-lg shadow-lg flex items-center ${
              notificationType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            {notificationType === 'success' ? (
              <CheckCircle className="text-green-500 mr-2" size={20} />
            ) : (
              <AlertCircle className="text-red-500 mr-2" size={20} />
            )}
            <p className={notificationType === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notificationMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ポイント消費確認モーダル */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">ポイント消費の確認</h3>
            <p className="text-gray-600 mb-4">
              この操作にはポイントが必要です。続行しますか？
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                onClick={cancelAction}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg"
                onClick={confirmAction}
              >
                続ける
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
