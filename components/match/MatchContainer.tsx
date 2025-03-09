import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from './ProfileCard';
import { theme } from '@/app/styles/theme';
import { useUser } from '@/components/UserContext';

// 仮のプロフィールデータ
const dummyProfiles = [
  {
    id: '1',
    name: '田中さくら',
    age: 28,
    location: '東京都',
    occupation: 'デザイナー',
    bio: '休日は美術館巡りやカフェでまったりすることが好きです。趣味は写真撮影と読書。一緒に東京の素敵なスポットを巡れる方との出会いを楽しみにしています。',
    images: ['/images/profile-1-1.jpg', '/images/profile-1-2.jpg', '/images/profile-1-3.jpg'],
    distance: 3,
    lastActive: '今日',
    tags: ['読書', 'カフェ', '美術', '写真'],
  },
  {
    id: '2',
    name: '鈴木あおい',
    age: 26,
    location: '神奈川県',
    occupation: 'マーケター',
    bio: 'アウトドア好きです！ハイキングやキャンプが趣味で、自然の中でリフレッシュするのが大好きです。美味しいものを食べるのも好きなので、おすすめのレストランがあれば教えてください。',
    images: ['/images/profile-2-1.jpg', '/images/profile-2-2.jpg'],
    distance: 15,
    lastActive: '30分前',
    tags: ['アウトドア', 'キャンプ', 'グルメ', '旅行'],
  },
  {
    id: '3',
    name: '佐藤ゆき',
    age: 29,
    location: '千葉県',
    occupation: '看護師',
    bio: '休日はヨガやジムで体を動かしています。健康的な生活が好きで、最近は料理にも凝っています。笑顔の絶えない関係を大切にしたいです。',
    images: ['/images/profile-3-1.jpg', '/images/profile-3-2.jpg', '/images/profile-3-3.jpg'],
    distance: 22,
    lastActive: '1時間前',
    tags: ['ヨガ', '料理', '健康', '音楽'],
  },
];

interface MatchContainerProps {
  onMatch?: (profileId: string) => void;
  onPointsChange?: (action: 'like' | 'superLike', amount: number, success: boolean) => void;
}

const MatchContainer: React.FC<MatchContainerProps> = ({ onMatch, onPointsChange }) => {
  const { points, isGenderMale } = useUser();
  const [profiles, setProfiles] = useState(dummyProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<typeof dummyProfiles[0] | null>(null);

  // コスト設定
  const ACTION_COSTS = {
    like: isGenderMale() ? 5 : 0,
    superLike: isGenderMale() ? 15 : 0,
  };

  // ポイント消費チェック
  const canAffordAction = (action: 'like' | 'superLike'): boolean => {
    if (!isGenderMale()) return true; // 女性ユーザーは無料
    return (points?.balance || 0) >= ACTION_COSTS[action];
  };

  // ポイント処理
  const processPoints = (action: 'like' | 'superLike'): boolean => {
    if (!canAffordAction(action)) {
      if (onPointsChange) {
        onPointsChange(action, ACTION_COSTS[action], false);
      }
      return false;
    }
    
    if (onPointsChange) {
      onPointsChange(action, ACTION_COSTS[action], true);
    }
    return true;
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up', profileId: string) => {
    // スーパーライクの場合（上スワイプ）
    if (direction === 'up') {
      if (!processPoints('superLike')) return;
      
      // スーパーライクは高確率でマッチング（70%）
      const isMatch = Math.random() < 0.7;
      
      if (isMatch) {
        const matchedProfile = profiles.find(p => p.id === profileId);
        if (matchedProfile) {
          setMatchedProfile(matchedProfile);
          setShowMatchAnimation(true);
          
          if (onMatch) {
            onMatch(profileId);
          }
        }
      }
    } 
    // 通常の右スワイプ（いいね）
    else if (direction === 'right') {
      if (!processPoints('like')) return;
      
      // 通常いいねは低確率でマッチング（30%）
      const isMatch = Math.random() < 0.3;
      
      if (isMatch) {
        const matchedProfile = profiles.find(p => p.id === profileId);
        if (matchedProfile) {
          setMatchedProfile(matchedProfile);
          setShowMatchAnimation(true);
          
          if (onMatch) {
            onMatch(profileId);
          }
        }
      }
    }
    
    // 次のプロフィールへ
    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 300);
  };

  // マッチングアニメーション後の処理
  useEffect(() => {
    if (showMatchAnimation) {
      const timer = setTimeout(() => {
        setShowMatchAnimation(false);
        setMatchedProfile(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showMatchAnimation]);

  // アクションボタンでのスワイプ
  const handleAction = (action: 'like' | 'pass' | 'superLike') => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile) {
      if (action === 'like') {
        handleSwipe('right', currentProfile.id);
      } else if (action === 'pass') {
        handleSwipe('left', currentProfile.id);
      } else if (action === 'superLike') {
        handleSwipe('up', currentProfile.id);
      }
    }
  };

  // プロフィールリストが終わった場合
  const noMoreProfiles = currentIndex >= profiles.length;

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* プロフィールカードエリア */}
      <div className="flex-1 relative w-full flex items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {!noMoreProfiles ? (
            <ProfileCard
              key={profiles[currentIndex].id}
              profile={profiles[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-6 bg-white rounded-xl shadow-md text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">周辺にいるユーザーを探索中</h3>
              <p className="text-neutral-500 mb-4">近くにいる新しいユーザーが表示されるまでしばらくお待ちください</p>
              <button 
                className="px-6 py-2 bg-primary-light text-primary-dark rounded-full font-medium"
                onClick={() => setProfiles(dummyProfiles) || setCurrentIndex(0)}
              >
                再読み込み
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* アクションボタン */}
      {!noMoreProfiles && (
        <div className="px-4 py-6 flex justify-center space-x-4 items-center">
          {/* パスボタン */}
          <motion.button
            className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center border border-neutral-200"
            whileTap={theme.animation.tap}
            onClick={() => handleAction('pass')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          
          {/* スーパーライクボタン */}
          <motion.button
            className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-neutral-200"
            whileTap={theme.animation.tap}
            onClick={() => handleAction('superLike')}
            title={`スーパーライク (${ACTION_COSTS.superLike}ポイント)`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {isGenderMale() && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {ACTION_COSTS.superLike}
              </span>
            )}
          </motion.button>
          
          {/* いいねボタン */}
          <motion.button
            className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center border border-neutral-200"
            whileTap={theme.animation.tap}
            onClick={() => handleAction('like')}
            title={`いいね (${ACTION_COSTS.like}ポイント)`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isGenderMale() && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {ACTION_COSTS.like}
              </span>
            )}
          </motion.button>
        </div>
      )}
      
      {/* マッチングアニメーション */}
      <AnimatePresence>
        {showMatchAnimation && matchedProfile && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-xs w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="relative mx-auto mb-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary">
                  <img 
                    src={matchedProfile.images[0]} 
                    alt={matchedProfile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-primary mb-1">マッチング成立！</h2>
              <p className="text-lg font-medium mb-4">{matchedProfile.name}さんとマッチングしました</p>
              <div className="flex justify-center mb-4">
                <div className="bg-neutral-100 rounded-full px-3 py-1 text-sm text-neutral-700">
                  メッセージを送ってみましょう
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-neutral-100 rounded-full text-neutral-700 font-medium">
                  あとで
                </button>
                <button className="flex-1 px-4 py-2 bg-primary rounded-full text-white font-medium">
                  メッセージを送る
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchContainer;
