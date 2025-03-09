"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, addDays, isToday, isSameDay, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { FaSun, FaMoon, FaMapMarkerAlt, FaYenSign, FaClock, FaCamera } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import CreateRecruitmentModal from '../components/recruitment/CreateRecruitmentModal';

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

export default function RecruitmentPage() {
  const router = useRouter();
  const userContext = useUser();
  const { user } = userContext;
  const isMale = userContext?.isGenderMale() ?? true;
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 日付表示用のデータを生成
  const dateTabs = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

  // モック募集データの作成
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const mockRecruitments: Recruitment[] = [
      {
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
      {
        id: '2',
        userId: 'user2',
        userName: 'もえ',
        age: 25,
        location: '神奈川県',
        profileImage: '/images/profile/user4.jpg', // user2.jpgは存在しないためuser4.jpgを代替として使用
        postedAt: '34分前',
        content: '15時から19時間、もしくは21時頃から2時間ほど暇しております。お茶でお顔合わせかパチンコとか行ける方居ましたらお会いしたいです☺️👌',
        budget: '相手と相談',
        meetingTime: 'day',
        meetingPlace: '神奈川県 / 横浜',
        gender: '女性',
        date: format(new Date(), 'yyyy-MM-dd'),
        expectedTime: '15時から19時間、もしくは21時頃から2時間'
      },
      {
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
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd')
      }
    ];

    setTimeout(() => {
      setRecruitments(mockRecruitments);
      setIsLoading(false);
    }, 500);
  }, []);

  // 日付でフィルタリングした募集を取得
  const getFilteredRecruitments = () => {
    if (!dateFilter) return recruitments;
    
    return recruitments.filter(recruitment => {
      const recruitmentDate = parseISO(recruitment.date);
      return isSameDay(recruitmentDate, dateFilter);
    });
  };

  const filteredRecruitments = getFilteredRecruitments();
  
  // フォーマットされた日付文字列を取得
  const getFormattedDateLabel = (date: Date) => {
    if (isToday(date)) {
      return `今日 ${format(date, 'M/d(E)', { locale: ja })}`;
    }
    return format(date, 'M/d(E)', { locale: ja });
  };

  // 表示している日付の文字列
  const currentDateLabel = dateFilter 
    ? getFormattedDateLabel(dateFilter)
    : '全ての募集';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-center flex-1">募集</h1>
          <button className="p-2">
            <FiFilter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* メイン */}
      <div className="pt-16 pb-20">
        {/* 日付選択タブ */}
        <div className="bg-white px-4 py-3 overflow-x-auto whitespace-nowrap flex space-x-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              dateFilter === null 
                ? 'bg-teal-400 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setDateFilter(null)}
          >
            すべて
          </button>
          
          {dateTabs.map((date, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                dateFilter && isSameDay(date, dateFilter)
                  ? 'bg-teal-400 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setDateFilter(date)}
            >
              {isToday(date) ? '今日' : ''} {format(date, 'M/d(E)', { locale: ja })}
            </button>
          ))}
        </div>

        {/* 募集リスト */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">{currentDateLabel}</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredRecruitments.length > 0 ? (
            <div className="space-y-4">
              {filteredRecruitments.map((recruitment) => (
                <Link href={`/recruitment/${recruitment.id}`} key={recruitment.id}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* 左側：プロフィール画像 */}
                      <div className="w-full md:w-1/3 p-4 flex justify-center items-center bg-gradient-to-br from-teal-50 to-white">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <Image
                            src={recruitment.profileImage}
                            alt={recruitment.userName}
                            fill
                            sizes="112px"
                            priority
                            className="hover:scale-105 transition-all duration-300"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/avatar1.jpg'; // 実際に存在する画像を使用
                            }}
                          />
                        </div>
                      </div>

                      {/* 右側：募集情報 */}
                      <div className="flex-1 p-4">
                        {/* ヘッダー：ユーザー情報と時間帯 */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <h3 className="text-lg font-bold text-gray-800">{recruitment.userName}</h3>
                              <span className="text-sm text-gray-500 ml-2 flex items-center">
                                <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5">{recruitment.age}歳</span>
                                <span className="mx-1">•</span>
                                <span>{recruitment.location}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {recruitment.meetingTime === 'day' ? (
                                <span className="inline-flex items-center text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                  <FaSun className="mr-1" />昼間の予定
                                </span>
                              ) : recruitment.meetingTime === 'night' ? (
                                <span className="inline-flex items-center text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                  <FaMoon className="mr-1" />夜の予定
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-xs font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                  <FaSun className="mr-1" /><FaMoon className="mx-1" />終日対応可
                                </span>
                              )}
                              <span className="text-xs text-gray-500 ml-auto bg-gray-50 px-2 py-1 rounded-full">{recruitment.postedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* 募集内容 */}
                        <div className="mb-3">
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-teal-400">
                            <p className="text-sm text-gray-700 line-clamp-2">{recruitment.content}</p>
                          </div>
                        </div>

                        {/* 詳細情報 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <FaMapMarkerAlt className="text-teal-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{recruitment.meetingPlace}</span>
                          </div>
                          
                          {recruitment.expectedTime && (
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                              <FaClock className="text-teal-500 mr-2 flex-shrink-0" />
                              <span className="truncate">{recruitment.expectedTime}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <FaYenSign className="text-teal-500 mr-2 flex-shrink-0" />
                            <span className="truncate">予算：{recruitment.budget}</span>
                          </div>
                          
                          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <span className={`w-6 h-6 flex items-center justify-center ${recruitment.gender === '男性' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'} rounded-full mr-2 text-xs font-bold`}>
                              {recruitment.gender === '男性' ? '男' : '女'}
                            </span>
                            <span className="truncate">
                              {recruitment.gender === '男性' ? '男性からの募集' : '女性からの募集'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-gray-500">
              <p className="text-center">この日の募集はまだありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 募集作成ボタン */}
      <motion.button
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full bg-teal-400 text-white shadow-lg flex items-center justify-center z-40"
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/recruitment/create')}
      >
        <FiPlus className="w-6 h-6" />
      </motion.button>

      {/* フッターナビゲーション */}
      <BottomNavigation />
      
      {/* 募集ボタン */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 shadow-lg z-30 flex items-center justify-center"
      >
        <span className="mr-2">
          <FiPlus className="w-5 h-5" />
        </span>
        <span className="font-medium">募集する</span>
      </button>
      
      {/* 募集作成モーダル */}
      <CreateRecruitmentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        isMale={isMale}
      />
    </div>
  );
}
