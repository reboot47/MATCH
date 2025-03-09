"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaYenSign, FaClock, FaSun, FaMoon } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUser } from '@/components/UserContext';

export default function CreateRecruitmentPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // フォーム状態
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    meetingTime: 'both',
    meetingPlace: '',
    budget: '',
    content: '',
    expectedTime: ''
  });

  // 入力変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 時間帯の選択
  const handleTimeChange = (timeType: 'day' | 'night' | 'both') => {
    setFormData(prev => ({
      ...prev,
      meetingTime: timeType
    }));
  };

  // 募集作成
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('ログインが必要です');
      return;
    }
    
    if (!formData.meetingPlace || !formData.budget || !formData.content) {
      toast.error('必須項目を入力してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 実際の実装ではAPIにデータを送信
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('募集を作成しました！');
      router.push('/recruitment');
    } catch (error) {
      console.error('募集作成エラー:', error);
      toast.error('募集の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-2"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-center flex-1">募集する</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-16 pb-6 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 日付選択 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <FaCalendarAlt className="mr-2 text-teal-500" />
              デート日
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              min={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          
          {/* 時間帯選択 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <FaClock className="mr-2 text-teal-500" />
              時間帯
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${
                  formData.meetingTime === 'day' 
                    ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => handleTimeChange('day')}
              >
                <FaSun className="mr-2" />
                昼
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${
                  formData.meetingTime === 'night' 
                    ? 'bg-indigo-100 text-indigo-600 border border-indigo-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => handleTimeChange('night')}
              >
                <FaMoon className="mr-2" />
                夜
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md flex items-center justify-center ${
                  formData.meetingTime === 'both' 
                    ? 'bg-purple-100 text-purple-600 border border-purple-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => handleTimeChange('both')}
              >
                <FaSun className="mr-1" />
                <FaMoon className="mr-1" />
                両方
              </button>
            </div>
          </div>
          
          {/* 時間帯の詳細 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              希望時間（任意）
            </label>
            <input
              type="text"
              name="expectedTime"
              placeholder="例: 18時から2時間ほど、午後なら終日など"
              value={formData.expectedTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
          {/* 場所 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-teal-500" />
              場所
            </label>
            <input
              type="text"
              name="meetingPlace"
              placeholder="例: 東京都 / 新宿、渋谷周辺"
              value={formData.meetingPlace}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          
          {/* 予算 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <FaYenSign className="mr-2 text-teal-500" />
              予算
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="">選択してください</option>
              <option value="相手と相談">相手と相談</option>
              <option value="~5,000円">~5,000円</option>
              <option value="5,000~10,000円">5,000~10,000円</option>
              <option value="10,000~20,000円">10,000~20,000円</option>
              <option value="20,000~30,000円">20,000~30,000円</option>
              <option value="30,000円~">30,000円~</option>
            </select>
          </div>
          
          {/* 募集内容 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              募集内容
            </label>
            <textarea
              name="content"
              placeholder="どのような内容でお相手を募集するか入力してください"
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          
          {/* 投稿ボタン */}
          <motion.button
            type="submit"
            className="w-full bg-teal-400 text-white py-3 rounded-md font-medium disabled:bg-gray-300 disabled:text-gray-500"
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                投稿中...
              </span>
            ) : (
              '募集する'
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
