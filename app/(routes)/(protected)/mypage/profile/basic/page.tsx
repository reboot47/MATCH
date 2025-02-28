'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

// 都道府県リスト - locationフィールドで使用
const prefectures = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// 身長のオプション（140cm〜200cm）
const heightOptions = Array.from({ length: 61 }, (_, i) => 140 + i);

// 職業のオプション - jobフィールドで使用
const occupations = [
  '会社員', '公務員', '自営業', 'フリーランス', '経営者', '専門職',
  '学生', 'パート・アルバイト', '専業主婦・主夫', 'その他'
];

// 学歴のオプション
const educations = [
  '高校卒', '専門学校卒', '短大卒', '大学卒', '大学院卒', 'その他'
];

type BasicProfileData = {
  gender?: string;
  birthdate?: string;
  location?: string;
  height?: number;
  job?: string;
  education?: string;
};

export default function BasicProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<BasicProfileData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // ユーザーの基本プロフィール情報を取得
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile(session.user.id);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}/profile`);
      const userData = response.data;
      
      // 必要なプロフィールデータを設定
      setProfileData({
        gender: userData.gender || '',
        birthdate: userData.birthdate || '',
        location: userData.location || '',
        height: userData.height || null,
        job: userData.job || '',
        education: userData.education || '',
      });
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // プロフィール更新の処理
  const handleInputChange = (key: keyof BasicProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 年齢計算関数
  const calculateAge = (birthdate: string): number => {
    if (!birthdate) return 0;
    
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // 基本プロフィールの保存
  const saveProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      setSaving(true);
      await axios.put(`/api/users/${session.user.id}/profile`, profileData);
      router.push('/mypage/profile/edit');
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      setSaving(false);
    }
  };
  
  // 生年月日の選択肢を生成
  const generateDateOptions = () => {
    const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 18 - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return { years, months, days };
  };
  
  const { years, months, days } = generateDateOptions();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  // 生年月日から年、月、日を抽出
  const birthdateObj = profileData.birthdate ? new Date(profileData.birthdate) : null;
  const birthYear = birthdateObj ? birthdateObj.getFullYear() : null;
  const birthMonth = birthdateObj ? birthdateObj.getMonth() + 1 : null;
  const birthDay = birthdateObj ? birthdateObj.getDate() : null;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => router.back()}>
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">基本プロフィール</h1>
          <button 
            onClick={saveProfile}
            className="text-teal-500 font-medium"
            disabled={saving}
          >
            {saving ? '保存中...' : '完了'}
          </button>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="flex-1 p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* 性別選択 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">性別</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleInputChange('gender', '男性')}
                className={`flex-1 py-2 rounded-md ${
                  profileData.gender === '男性' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                男性
              </button>
              <button
                onClick={() => handleInputChange('gender', '女性')}
                className={`flex-1 py-2 rounded-md ${
                  profileData.gender === '女性' 
                    ? 'bg-pink-100 text-pink-700 border border-pink-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                女性
              </button>
            </div>
          </div>
          
          {/* 生年月日選択 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              生年月日
              {birthYear && birthMonth && birthDay && (
                <span className="ml-2 text-gray-500">
                  （{calculateAge(`${birthYear}-${birthMonth}-${birthDay}`)}歳）
                </span>
              )}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthYear || ''}
                onChange={(e) => {
                  const newYear = e.target.value;
                  const newDate = new Date(
                    Number(newYear),
                    birthMonth ? birthMonth - 1 : 0,
                    birthDay || 1
                  );
                  handleInputChange('birthdate', newDate.toISOString());
                }}
                className="p-2 border rounded-md"
              >
                <option value="">年</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
              
              <select
                value={birthMonth || ''}
                onChange={(e) => {
                  const newMonth = e.target.value;
                  const newDate = new Date(
                    birthYear || new Date().getFullYear(),
                    Number(newMonth) - 1,
                    birthDay || 1
                  );
                  handleInputChange('birthdate', newDate.toISOString());
                }}
                className="p-2 border rounded-md"
              >
                <option value="">月</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
              
              <select
                value={birthDay || ''}
                onChange={(e) => {
                  const newDay = e.target.value;
                  const newDate = new Date(
                    birthYear || new Date().getFullYear(),
                    birthMonth ? birthMonth - 1 : 0,
                    Number(newDay)
                  );
                  handleInputChange('birthdate', newDate.toISOString());
                }}
                className="p-2 border rounded-md"
              >
                <option value="">日</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}日</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 住んでいる地域 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">住んでいる地域</h3>
            <select
              value={profileData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">選択してください</option>
              {prefectures.map(prefecture => (
                <option key={prefecture} value={prefecture}>{prefecture}</option>
              ))}
            </select>
          </div>
          
          {/* 身長 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">身長</h3>
            <select
              value={profileData.height || ''}
              onChange={(e) => handleInputChange('height', Number(e.target.value) || null)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">選択してください</option>
              {heightOptions.map(height => (
                <option key={height} value={height}>{height}cm</option>
              ))}
            </select>
          </div>
          
          {/* 職業 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">職業</h3>
            <select
              value={profileData.job || ''}
              onChange={(e) => handleInputChange('job', e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">選択してください</option>
              {occupations.map(occupation => (
                <option key={occupation} value={occupation}>{occupation}</option>
              ))}
            </select>
          </div>
          
          {/* 学歴 */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">学歴</h3>
            <select
              value={profileData.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">選択してください</option>
              {educations.map(education => (
                <option key={education} value={education}>{education}</option>
              ))}
            </select>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
