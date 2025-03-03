"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// 新しいコンポーネントのインポート
import ProfileNavigation from '../components/profile/ProfileNavigation';
import ProfileCompletionCard from '../components/profile/ProfileCompletionCard';
import MediaGallery from '../components/profile/MediaGallery';
import PersonalityTest from '../components/profile/PersonalityTest';
import ProfileDetails from '../components/profile/ProfileDetails';
import MatchingPreferences from '../components/profile/MatchingPreferences';
import VerificationCenter from '../components/profile/VerificationCenter';

// モックデータ型定義
interface UserWithPhotos {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  interests: string[];
  personalityType?: string;
  personalityTraits?: Record<string, number>;
  personalityTestCompleted?: boolean;
  profileCompletionPercentage?: number;
  mediaItems: {
    id: string;
    url: string;
    type: 'image' | 'video';
    caption?: string;
    isPrimary?: boolean;
    thumbnail?: string;
  }[];
  emailVerified?: Date | null;
  phoneVerified?: boolean;
  photoVerified?: boolean;
  idVerified?: boolean;
  linkedinVerified?: boolean;
  matchingPreferences?: {
    ageRange: [number, number];
    distance: number;
    genderPreference: string;
    priorities: Record<string, number>;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithPhotos | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // ユーザー情報とプロフィール写真の取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (status === 'loading') return;
        
        if (!session || !session.user) {
          router.push('/login');
          return;
        }
        
        const userId = session.user.id;
        const response = await fetch(`/api/users/${userId}`);
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.log('APIレスポンスがOKではありません。モックデータを使用します。');
          // APIエンドポイントが失敗した場合はモックデータを使用
          const mockUser: UserWithPhotos = {
            id: session.user.id || "1",
            name: session.user.name || "鈴木 太郎",
            email: session.user.email || "user@example.com",
            image: session.user.image || "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "東京在住のWebデザイナーです。写真とアウトドア活動が好きで、週末はよく山登りやカメラを持って散策しています。新しい出会いを通じて人生をより豊かにしたいと思っています。",
            age: 30,
            gender: "male",
            location: "東京都渋谷区",
            occupation: "Webデザイナー",
            interests: ["写真", "登山", "カフェ巡り", "旅行", "読書"],
            personalityType: "INFP",
            personalityTraits: {
              extraversion: 65,
              agreeableness: 82,
              conscientiousness: 70,
              emotional_stability: 75,
              openness: 90
            },
            personalityTestCompleted: true,
            profileCompletionPercentage: 85,
            mediaItems: [
              {
                id: "p1",
                url: session.user.image || "https://randomuser.me/api/portraits/men/32.jpg",
                type: "image",
                caption: "プロフィール写真",
                isPrimary: true
              },
              {
                id: "p2",
                url: "https://images.unsplash.com/photo-1527631120902-378417754324",
                type: "image",
                caption: "富士山登山にて"
              },
              {
                id: "p3",
                url: "https://images.unsplash.com/photo-1516216628859-9c66c49baba8",
                type: "image",
                caption: "愛犬のポチと"
              },
              {
                id: "v1",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                type: "video",
                caption: "趣味の紹介動画",
                thumbnail: "https://peach.blender.org/wp-content/uploads/bbb-splash.png"
              }
            ],
            emailVerified: new Date(),
            phoneVerified: true,
            photoVerified: true,
            idVerified: false,
            linkedinVerified: false,
            matchingPreferences: {
              ageRange: [25, 38],
              distance: 30,
              genderPreference: 'female',
              priorities: {
                age: 3,
                distance: 4,
                interests: 5,
                occupation: 2,
                personality: 4
              }
            }
          };
          
          setUser(mockUser);
          toast.error('APIからのデータ取得に失敗しました。デモデータを表示しています。');
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        toast.error('プロフィールの読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, status]);

  // プロフィールの更新
  const handleUpdateProfile = async (updatedData: any) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, ...updatedUser });
        toast.success('プロフィールを更新しました');
        return true;
      } else {
        const error = await response.json();
        toast.error(error.error || 'プロフィールの更新に失敗しました');
        return false;
      }
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      toast.error('プロフィールの更新中にエラーが発生しました');
      return false;
    }
  };

  // メディアの更新
  const handleUpdateMedia = async (mediaItems: any[]) => {
    if (!user) return;
    
    try {
      // ここでは簡易的にステート更新のみ行います
      // 実際のAPI連携時はここでAPIを呼び出します
      setUser({
        ...user,
        mediaItems
      });
      toast.success('メディアを更新しました');
      return true;
    } catch (error) {
      console.error('メディア更新エラー:', error);
      toast.error('メディアの更新中にエラーが発生しました');
      return false;
    }
  };

  // 性格診断結果の保存
  const handleSavePersonalityResults = async (results: any) => {
    if (!user) return;
    
    try {
      // ここでは簡易的にステート更新のみ行います
      setUser({
        ...user,
        personalityType: results.personalityType,
        personalityTraits: results.traits,
        personalityTestCompleted: true
      });
      toast.success('性格診断結果を保存しました');
      return true;
    } catch (error) {
      console.error('性格診断保存エラー:', error);
      toast.error('性格診断結果の保存中にエラーが発生しました');
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-orange-400">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // アクティブなタブに基づいてコンテンツをレンダリング
  const renderActiveTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileCompletionCard 
              percentage={user.profileCompletionPercentage || 60} 
              user={user} 
            />
            <ProfileDetails 
              user={user} 
              editable={true} 
              onSave={handleUpdateProfile}
            />
          </div>
        );

      case 'media':
        return (
          <MediaGallery 
            mediaItems={user.mediaItems} 
            editable={true}
            onUpdate={handleUpdateMedia}
            maxMediaCount={9}
          />
        );

      case 'interests':
        return (
          <ProfileDetails 
            user={user} 
            editable={true} 
            onSave={handleUpdateProfile}
            showInterestsOnly={true}
          />
        );

      case 'personality':
        return (
          <PersonalityTest 
            userResults={user.personalityTestCompleted ? {
              personalityType: user.personalityType,
              traits: user.personalityTraits
            } : undefined} 
            onSaveResults={handleSavePersonalityResults}
          />
        );

      case 'matching':
        return (
          <MatchingPreferences 
            preferences={user.matchingPreferences} 
            editable={true}
          />
        );

      case 'verification':
        return <VerificationCenter user={user} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-4 px-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/logo-white.svg" 
              alt="LINEBUZZ" 
              width={36} 
              height={36}
              className="mr-2"
            />
            <h1 className="text-xl font-bold">LINEBUZZ</h1>
          </div>
          {user && (
            <div className="flex items-center">
              <img 
                src={user.image || "https://randomuser.me/api/portraits/men/32.jpg"} 
                alt={user.name || "ユーザー"} 
                width={36} 
                height={36} 
                className="rounded-full"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">マイプロフィール</h2>
        
        <div className="flex flex-col gap-6">
          {/* タブナビゲーション - モバイルファースト */}
          <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <ProfileNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={user}
              tabs={[
                { id: 'profile', label: 'プロフィール' },
                { id: 'media', label: 'メディア' },
                { id: 'interests', label: '興味' },
                { id: 'personality', label: '性格診断' },
                { id: 'matching', label: 'マッチング' },
                { id: 'verification', label: '認証' },
              ]}
            />
          </div>
          
          {/* メインコンテンツエリア */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                {renderActiveTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
