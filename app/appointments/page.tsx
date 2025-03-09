"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronLeft } from 'react-icons/hi';
import { useUser } from '../../components/UserContext';

// 約束データの型定義
interface Appointment {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerImage: string;
  partnerAge: number;
  partnerLocation: string;
  partnerOccupation?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  hasGivenFeedback: boolean;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const userContext = useUser();
  
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // 実際のアプリではAPIリクエストを行う
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ
        if (activeTab === 'past') {
          const pastAppointments: Appointment[] = [
            {
              id: '1',
              partnerId: 'user1',
              partnerName: 'りったん',
              partnerImage: '/images/placeholder-user.jpg',
              partnerAge: 31,
              partnerLocation: '大阪府',
              partnerOccupation: '美容師',
              date: '2025/03/07',
              status: 'completed',
              hasGivenFeedback: false
            },
            {
              id: '2',
              partnerId: 'user2',
              partnerName: 'Mijyu♥',
              partnerImage: '/images/placeholder-user.jpg',
              partnerAge: 31,
              partnerLocation: '大阪府',
              partnerOccupation: 'アパレル・ショップ',
              date: '2025/03/02',
              status: 'completed',
              hasGivenFeedback: false
            },
            {
              id: '3',
              partnerId: 'user3',
              partnerName: 'せら',
              partnerImage: '/images/placeholder-user.jpg',
              partnerAge: 20,
              partnerLocation: '愛知県',
              partnerOccupation: '学生',
              date: '2025/02/21',
              status: 'completed',
              hasGivenFeedback: false
            }
          ];
          setAppointments(pastAppointments);
        } else {
          // 現在の約束はないと仮定
          setAppointments([]);
        }
      } catch (error) {
        console.error('約束データの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [activeTab]);

  const handleGiveFeedback = (appointmentId: string) => {
    router.push(`/appointments/feedback/${appointmentId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiChevronLeft size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">約束</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* タブ切り替え */}
      <div className="pt-16 bg-white border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'current' 
                ? 'text-teal-600 border-b-2 border-teal-500' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('current')}
          >
            進行中の約束
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'past' 
                ? 'text-teal-600 border-b-2 border-teal-500' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('past')}
          >
            過去の約束
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-grow pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {appointments.length === 0 && activeTab === 'current' && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth={1.5} />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-800 mb-4">まだ約束がありません。</h2>
                <p className="text-gray-600 text-center mb-8">
                  約束をしたいお相手とのチャット画面で、<br />
                  カレンダーのアイコンをタップすると約束できます。
                </p>
                <button
                  onClick={() => router.push('/match/chat')}
                  className="w-full max-w-md bg-teal-500 text-white py-3 rounded-md font-medium hover:bg-teal-600"
                >
                  約束機能をつかってみる
                </button>
              </div>
            )}

            {appointments.length === 0 && activeTab === 'past' && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-800 mb-4">過去の約束はありません。</h2>
              </div>
            )}

            {appointments.length > 0 && (
              <div className="divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white p-4 flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 mr-4">
                      <Image 
                        src={appointment.partnerImage} 
                        alt={appointment.partnerName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <h3 className="font-medium text-gray-800 mr-2">{appointment.partnerName}</h3>
                        <span className="text-sm text-gray-600">{appointment.partnerAge}歳 {appointment.partnerLocation}</span>
                      </div>
                      <p className="text-sm text-gray-500">{appointment.partnerOccupation}</p>
                      <p className="text-xs text-gray-400 mt-1">{appointment.date}</p>
                    </div>
                    <button
                      onClick={() => handleGiveFeedback(appointment.id)}
                      className="px-4 py-2 bg-teal-500 text-white rounded-md text-sm"
                    >
                      フィードバック
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
