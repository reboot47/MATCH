"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiChevronLeft, HiX } from 'react-icons/hi';
import { useUser } from '../../../../components/UserContext';

interface FeedbackOptions {
  dateImpression: 'きっちり' | 'どちらでもない' | 'マイペース' | null;
  atmosphere: '明るい' | 'どちらでもない' | '落ち着きがある' | null;
  faceType: '可愛い' | 'どちらでもない' | '綺麗' | null;
  bodyType: 'スリム' | 'どちらでもない' | 'グラマー' | null;
}

interface PartnerInfo {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  occupation?: string;
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const userContext = useUser();
  
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [feedback, setFeedback] = useState<FeedbackOptions>({
    dateImpression: null,
    atmosphere: null,
    faceType: null,
    bodyType: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setIsLoading(true);
      try {
        // 実際のアプリではAPIリクエストを行う
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ
        if (id === '1') {
          setPartner({
            id: 'user1',
            name: 'りったん',
            age: 31,
            location: '大阪府',
            image: '/images/placeholder-user.jpg',
            occupation: '美容師'
          });
        } else if (id === '2') {
          setPartner({
            id: 'user2',
            name: 'Mijyu♥',
            age: 31,
            location: '大阪府',
            image: '/images/placeholder-user.jpg',
            occupation: 'アパレル・ショップ'
          });
        } else if (id === '3') {
          setPartner({
            id: 'user3',
            name: 'せら',
            age: 20,
            location: '愛知県',
            image: '/images/placeholder-user.jpg',
            occupation: '学生'
          });
        }
      } catch (error) {
        console.error('約束データの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointmentDetails();
  }, [id]);

  const handleOptionSelect = (category: keyof FeedbackOptions, value: any) => {
    setFeedback(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const handleReset = () => {
    setFeedback({
      dateImpression: null,
      atmosphere: null,
      faceType: null,
      bodyType: null
    });
  };

  const handleSubmit = async () => {
    if (!partner) return;
    
    setIsSending(true);
    try {
      // 実際のアプリではAPIリクエストを行う
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('送信されたフィードバック:', {
        appointmentId: id,
        partnerId: partner.id,
        feedback
      });
      
      // 成功後に戻る
      router.push('/appointments');
    } catch (error) {
      console.error('フィードバックの送信に失敗しました', error);
      setIsSending(false);
    }
  };

  const isFeedbackComplete = Object.values(feedback).every(value => value !== null);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600"
            aria-label="戻る"
          >
            <HiChevronLeft size={24} />
          </button>
          <h1 className="text-center flex-grow font-medium text-lg">フィードバック</h1>
          <div className="w-8"></div>
        </header>
        <div className="pt-16 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600"
            aria-label="戻る"
          >
            <HiChevronLeft size={24} />
          </button>
          <h1 className="text-center flex-grow font-medium text-lg">フィードバック</h1>
          <div className="w-8"></div>
        </header>
        <div className="pt-16 flex justify-center items-center h-64">
          <p className="text-gray-600">約束情報が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiX size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">フィードバック</h1>
        <div className="w-8"></div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-16 pb-20">
        <div className="bg-white p-6 mb-4">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <Image 
                src={partner.image} 
                alt={partner.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-xl">{partner.name}さんと</p>
              <p className="text-gray-700">お会いしてみていかがでしたか？</p>
              <p className="text-xs text-gray-500 mt-1">※フィードバックの内容はお相手には見えません。</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 mb-4">
          <div className="mb-4">
            <p className="font-medium text-sm text-gray-600 mb-2">約束 <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 px-4 rounded-full border ${feedback.dateImpression === 'きっちり' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('dateImpression', 'きっちり')}
              >
                きっちり
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.dateImpression === 'どちらでもない' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('dateImpression', 'どちらでもない')}
              >
                どちらでもない
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.dateImpression === 'マイペース' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('dateImpression', 'マイペース')}
              >
                マイペース
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium text-sm text-gray-600 mb-2">雰囲気 <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 px-4 rounded-full border ${feedback.atmosphere === '明るい' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('atmosphere', '明るい')}
              >
                明るい
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.atmosphere === 'どちらでもない' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('atmosphere', 'どちらでもない')}
              >
                どちらでもない
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.atmosphere === '落ち着きがある' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('atmosphere', '落ち着きがある')}
              >
                落ち着きがある
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium text-sm text-gray-600 mb-2">顔の系統 <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 px-4 rounded-full border ${feedback.faceType === '可愛い' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('faceType', '可愛い')}
              >
                可愛い
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.faceType === 'どちらでもない' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('faceType', 'どちらでもない')}
              >
                どちらでもない
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.faceType === '綺麗' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('faceType', '綺麗')}
              >
                綺麗
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium text-sm text-gray-600 mb-2">スタイル <span className="text-red-500">*</span></p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 px-4 rounded-full border ${feedback.bodyType === 'スリム' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('bodyType', 'スリム')}
              >
                スリム
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.bodyType === 'どちらでもない' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('bodyType', 'どちらでもない')}
              >
                どちらでもない
              </button>
              <button
                className={`py-2 px-4 rounded-full border ${feedback.bodyType === 'グラマー' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleOptionSelect('bodyType', 'グラマー')}
              >
                グラマー
              </button>
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="p-4 bg-white border-t fixed bottom-0 left-0 right-0 flex space-x-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 flex-shrink-0"
          >
            リセット
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFeedbackComplete || isSending}
            className={`flex-grow py-3 rounded-md text-white font-medium ${isFeedbackComplete && !isSending ? 'bg-teal-600' : 'bg-gray-400'}`}
          >
            {isSending ? '送信中...' : '送信する'}
          </button>
        </div>
      </main>
    </div>
  );
}
