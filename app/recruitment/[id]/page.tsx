"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FaArrowLeft, FaMapMarkerAlt, FaYenSign, FaClock, FaSun, FaMoon, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';

// 募集の型定義
interface Recruitment {
  id: string;
  userId: string;
  userName: string;
  age: number;
  location: string;
  profileImage: string;
  postedAt: string;
  content: string;
  budget: string;
  meetingTime: 'day' | 'night' | 'both';
  meetingPlace: string;
  gender: '男性' | '女性';
  date: string;
  expectedTime?: string;
}

// モックの募集データ
const mockRecruitments: Record<string, Recruitment> = {
  '1': {
    id: '1',
    userId: 'user1',
    userName: 'みーしゃん',
    age: 22,
    location: '東京都',
    profileImage: '/images/profile/user1.jpg',
    postedAt: '21分前',
    content: 'お顔合わせのお食事がお茶でもできるかたお探ししています〜^ ^もしフィーリングあえば長期的に仲良くなれましたら嬉しいです😊',
    budget: '相手と相談',
    meetingTime: 'night',
    meetingPlace: '愛知県 / 名古屋駅、栄付近',
    gender: '女性',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  '2': {
    id: '2',
    userId: 'user2',
    userName: 'もえ',
    age: 25,
    location: '神奈川県',
    profileImage: '/images/profile/user2.jpg',
    postedAt: '34分前',
    content: '15時から19時間、もしくは21時頃から2時間ほど暇しております。お茶でお顔合わせかパチンコとか行ける方居ましたらお会いしたいです☺️👌',
    budget: '相手と相談',
    meetingTime: 'day',
    meetingPlace: '神奈川県 / 横浜',
    gender: '女性',
    date: format(new Date(), 'yyyy-MM-dd'),
    expectedTime: '15時から19時間、もしくは21時頃から2時間'
  },
  '3': {
    id: '3',
    userId: 'user3',
    userName: 'たけし',
    age: 28,
    location: '大阪府',
    profileImage: '/images/profile/user3.jpg',
    postedAt: '1時間前',
    content: '大阪市内でディナーできる方を探しています。予算は1万円程度考えています。気が合えば定期的に会える関係になれたら嬉しいです。',
    budget: '1万円程度',
    meetingTime: 'night',
    meetingPlace: '大阪府 / 梅田、難波周辺',
    gender: '男性',
    date: format(parseISO('2025-03-08'), 'yyyy-MM-dd')
  }
};

export default function RecruitmentDetailPage() {
  const paramsPromise = useParams();
  // React.use()でパラメータを適切に処理
  const params = React.use(paramsPromise as any);
  const id = params.id as string;
  const router = useRouter();
  const { user, points } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [showContactOptions, setShowContactOptions] = useState(false);
  
  // ポイント消費設定（男性側）
  const CONTACT_POINTS_COST = 10;

  useEffect(() => {
    const fetchRecruitment = async () => {
      // 実際の実装ではAPIからデータを取得
      try {
        // 実際の実装では以下の代わりにAPI呼び出しをする
        // const response = await fetch(`/api/recruitments/${id}`);
        // const data = await response.json();
        
        // モックデータを使用
        const data = mockRecruitments[id];
        
        if (!data) {
          toast.error('募集が見つかりませんでした');
          router.push('/recruitment');
          return;
        }
        
        setRecruitment(data);
      } catch (error) {
        console.error('募集取得エラー:', error);
        toast.error('募集情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecruitment();
  }, [id, router]);

  // コンタクトオプションを表示
  const handleContactClick = () => {
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    setShowContactOptions(true);
  };

  // コンタクト送信処理
  const handleSendContact = async (type: string) => {
    if (!user || !recruitment) return;
    
    // 男性ユーザーの場合、ポイント確認
    if (user.gender === '男性') {
      if (!points || points.balance < CONTACT_POINTS_COST) {
        toast.error(`ポイントが不足しています。必要ポイント: ${CONTACT_POINTS_COST}`);
        router.push('/points/purchase');
        return;
      }
    }
    
    try {
      // 実際の実装ではAPIにコンタクト送信の処理を行う
      // await fetch('/api/contacts', {...});
      
      // 処理成功
      if (user.gender === '男性') {
        toast.success(`${CONTACT_POINTS_COST}ポイントを消費しました`);
      }
      
      toast.success(`${recruitment.userName}さんに${type}を送信しました！`);
      // 少し待ってからメッセージ画面に遷移
      setTimeout(() => {
        router.push('/messages');
      }, 1500);
    } catch (error) {
      console.error('コンタクト送信エラー:', error);
      toast.error('送信に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!recruitment) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <p className="text-gray-600 mb-4">募集が見つかりませんでした</p>
        <button 
          className="px-4 py-2 bg-primary-500 text-white rounded-md"
          onClick={() => router.push('/recruitment')}
        >
          募集一覧に戻る
        </button>
      </div>
    );
  }

  // 日付表示
  const formattedDate = format(parseISO(recruitment.date), 'yyyy年M月d日(E)', { locale: ja });
  
  // 自分の募集かどうか
  const isMyRecruitment = user?.id === recruitment.userId;

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      
      
      {/* ヘッダー */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-2"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-center flex-1">募集詳細</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-16 px-4">
        {/* ユーザー情報 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-start">
            <Link href={`/user/${recruitment.userId}`}>
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={recruitment.profileImage}
                  alt={recruitment.userName}
                  fill
                  sizes="64px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Link>
            <div>
              <Link href={`/user/${recruitment.userId}`}>
                <h2 className="text-lg font-medium">{recruitment.userName}</h2>
              </Link>
              <p className="text-gray-600">{recruitment.age}歳 {recruitment.location}</p>
              <div className="flex mt-1">
                {recruitment.meetingTime === 'day' ? (
                  <span className="inline-flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded mr-2">
                    <FaSun className="mr-1" />昼
                  </span>
                ) : recruitment.meetingTime === 'night' ? (
                  <span className="inline-flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded mr-2">
                    <FaMoon className="mr-1" />夜
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded mr-2">
                    <FaSun className="mr-1" /><FaMoon className="mr-1" />終日
                  </span>
                )}
                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {recruitment.postedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 募集内容 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">募集内容</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
            <p className="whitespace-pre-line">{recruitment.content}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <span>{formattedDate}</span>
            </div>
            
            {recruitment.expectedTime && (
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-3" />
                <span>{recruitment.expectedTime}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <span>{recruitment.meetingPlace}</span>
            </div>
            
            <div className="flex items-center">
              <FaYenSign className="text-gray-400 mr-3" />
              <span>予算：{recruitment.budget}</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-3 text-xs">
                {recruitment.gender === '男性' ? '男' : '女'}
              </span>
              <span>
                {recruitment.gender === '男性' ? '男性からの募集' : '女性からの募集'}
              </span>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        {!isMyRecruitment && (
          <div className="mt-6">
            {!showContactOptions ? (
              <motion.button
                className="w-full bg-teal-400 text-white py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.98 }}
                onClick={handleContactClick}
              >
                連絡する
              </motion.button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-gray-600 mb-2">
                  {user?.gender === '男性' && (
                    <span className="block text-sm text-red-500 mb-1">
                      ※コンタクトには{CONTACT_POINTS_COST}ポイント必要です
                    </span>
                  )}
                  連絡方法を選んでください
                </p>
                
                <motion.button
                  className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium mb-2"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendContact('相手に合わせる')}
                >
                  相手に合わせる
                </motion.button>
                
                <motion.button
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mb-2"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendContact('お茶したい')}
                >
                  お茶したい
                </motion.button>
                
                <motion.button
                  className="w-full bg-indigo-500 text-white py-3 rounded-lg font-medium"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendContact('食事したい')}
                >
                  食事したい
                </motion.button>
                
                <button
                  className="w-full text-gray-500 py-2 mt-3"
                  onClick={() => setShowContactOptions(false)}
                >
                  キャンセル
                </button>
              </div>
            )}
            
            <div className="mt-3 flex justify-center">
              <button className="flex items-center text-gray-500 px-4 py-2 rounded-md">
                <FaHeart className="text-gray-300 mr-2" />
                いいね
              </button>
            </div>
          </div>
        )}
        
        {/* 自分の募集の場合は編集・削除ボタンを表示 */}
        {isMyRecruitment && (
          <div className="mt-6 space-y-3">
            <motion.button
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/recruitment/edit/${id}`)}
            >
              編集する
            </motion.button>
            
            <motion.button
              className="w-full bg-red-50 text-red-500 py-3 rounded-lg font-medium"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (confirm('この募集を削除しますか？')) {
                  // 削除処理
                  toast.success('募集を削除しました');
                  router.push('/recruitment');
                }
              }}
            >
              削除する
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
