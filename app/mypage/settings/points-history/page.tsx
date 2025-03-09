"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

interface PointHistoryItem {
  id: string;
  date: string;
  description: string;
  points: number;
  isPositive: boolean;
}

export default function PointsHistoryPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true;
  
  const [currentPoints, setCurrentPoints] = useState(3);
  const [expiryDate, setExpiryDate] = useState('2025年09月04日');
  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = 5; // 仮の総ページ数
  
  useEffect(() => {
    // 実際のアプリではAPIからポイント履歴を取得
    const fetchPointHistory = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 現在のポイント
        setCurrentPoints(3);
        
        // モックデータ - ポイント履歴
        const mockHistory: PointHistoryItem[] = [
          { id: '1', date: '2025/03/08', description: 'アピール動画(動画で探す)', points: 3, isPositive: false },
          { id: '2', date: '2025/03/08', description: 'みてね！', points: 5, isPositive: false },
          { id: '3', date: '2025/03/08', description: 'メッセージ付きいいね', points: 18, isPositive: false },
          { id: '4', date: '2025/03/08', description: 'いいねへの交換', points: 10, isPositive: false },
          { id: '5', date: '2025/03/08', description: 'ミッションボーナス', points: 4, isPositive: true },
          { id: '6', date: '2025/03/08', description: 'ポイント購入', points: 30, isPositive: true },
          { id: '7', date: '2025/03/07', description: 'サブ写真(発見機能)', points: 1, isPositive: false },
          { id: '8', date: '2025/03/07', description: 'メイン写真(発見機能)', points: 5, isPositive: false },
          { id: '9', date: '2025/03/07', description: 'アピール動画(発見機能)', points: 9, isPositive: false },
          { id: '10', date: '2025/03/07', description: 'ミッションボーナス', points: 2, isPositive: true },
          { id: '11', date: '2025/03/06', description: 'プロフィール更新ボーナス', points: 3, isPositive: true },
          { id: '12', date: '2025/03/06', description: '年齢確認ボーナス', points: 5, isPositive: true }
        ];
        
        setPointHistory(mockHistory);
      } catch (error) {
        console.error('ポイント履歴の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPointHistory();
  }, []);

  // 現在のページのデータを取得
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pointHistory.slice(startIndex, endIndex);
  };

  // ページネーション用の数字配列を生成
  const getPaginationNumbers = () => {
    const numbers = [];
    const displayPages = 3; // 表示するページ番号の数
    
    let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
    let endPage = Math.min(totalPages, startPage + displayPages - 1);
    
    if (endPage - startPage + 1 < displayPages) {
      startPage = Math.max(1, endPage - displayPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }
    
    return numbers;
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
        <h1 className="text-center flex-grow font-medium text-lg">コイン</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div>
            {/* 上部のタブ */}
            <div className="flex border-b border-gray-200">
              <div className="w-1/2 bg-teal-500 text-white py-3 text-center font-medium">
                コイン
              </div>
              <div className="w-1/2 bg-gray-100 text-gray-600 py-3 text-center font-medium">
                いいね
              </div>
            </div>
            
            {/* 残高表示 */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">残ポイント</span>
                  <span className="text-yellow-500 text-lg">●</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{currentPoints}pt</span>
                  <span className="text-teal-500 ml-2">●</span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {expiryDate} 失効予定 {currentPoints}pt
              </div>
            </div>
            
            {/* ポイント履歴 */}
            <div className="bg-white">
              {getCurrentPageItems().map((item) => (
                <div key={item.id} className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <div className="text-gray-800">{item.description}</div>
                  </div>
                  <div className={`font-medium ${item.isPositive ? 'text-teal-500' : ''}`}>
                    {item.isPositive ? `+${item.points}pt` : `${item.points}pt`}
                  </div>
                </div>
              ))}
            </div>
            
            {/* ページネーション */}
            <div className="p-4 flex justify-center items-center">
              <div className="text-sm text-gray-500 mr-4">
                50件中1～10件を表示
              </div>
              <div className="flex items-center">
                {currentPage > 1 && (
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-1"
                  >
                    <HiChevronLeft size={16} />
                  </button>
                )}
                
                {getPaginationNumbers().map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`h-8 w-8 flex items-center justify-center rounded-full mx-1 ${
                      currentPage === number 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                {currentPage < totalPages && (
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 ml-1"
                  >
                    <HiChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* 注意書き */}
            <div className="p-4 text-xs text-gray-500">
              <p>※ ポイントは、有効期限が近いものから順に消費されます。</p>
              <p>※ ご購入いただいたポイントの有効期限は、購入日を含め180日です。</p>
              <p>※ ボーナスでもらえるポイントは、期間限定のポイントが含まれる場合があります。</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
