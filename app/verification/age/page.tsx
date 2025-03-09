"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiX, HiCheckCircle, HiQuestionMarkCircle } from 'react-icons/hi';

const AgeVerificationPage = () => {
  const router = useRouter();
  const [selectedIdType, setSelectedIdType] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('1993-10-17');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 前のページに戻る
  const handleBack = () => {
    router.back();
  };
  
  // カメラを起動
  const handleStartCamera = () => {
    if (!selectedIdType) {
      alert('身分証明書の種類を選択してください');
      return;
    }
    setShowCamera(true);
  };
  
  // 画像を撮影
  const handleCapture = () => {
    // 実際はカメラAPIで画像を撮影する処理をここに実装
    setShowCamera(false);
    setCapturedImage(true);
  };
  
  // 送信処理
  const handleSubmit = () => {
    if (!capturedImage) {
      alert('身分証明書の写真を撮影してください');
      return;
    }
    
    setIsSubmitting(true);
    
    // 実際はここでAPIサーバーに送信する処理
    setTimeout(() => {
      setIsSubmitting(false);
      alert('年齢確認申請が送信されました');
      router.push('/mypage');
    }, 1500);
  };
  
  // IDタイプを選択
  const handleSelectIdType = (type: string) => {
    setSelectedIdType(type);
  };
  
  // 進行状況を確認
  const getProgress = () => {
    if (isSubmitting) return 100;
    if (capturedImage) return 66;
    if (selectedIdType) return 33;
    return 0;
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center px-4 py-3">
          <button onClick={handleBack} className="p-2">
            <HiX className="text-gray-600 text-xl" />
          </button>
          <h1 className="text-lg font-medium text-center flex-1">年齢確認</h1>
          <div className="w-8"></div>
        </div>
        
        {/* プログレスバー */}
        <div className="h-1 w-full bg-gray-200">
          <div 
            className="h-full bg-teal-500 transition-all duration-500" 
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="pt-16 pb-20 px-4">
        {showCamera ? (
          <CameraView onCapture={handleCapture} />
        ) : (
          <div className="flex flex-col">
            {/* 説明部分 */}
            <div className="w-full bg-teal-100 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold text-teal-800 text-center mb-3">年齢確認のご案内</h2>
              <p className="text-teal-700 text-center mb-2">
                関連法規に基づき、メッセージのやりとりが可能になる前に
                年齢確認を必須としています
              </p>
              
              <div className="flex justify-center mt-4">
                <div className="relative w-24 h-24">
                  <div className="w-full h-full bg-teal-200 rounded-full flex items-center justify-center">
                    <div className="text-4xl text-teal-500">🆔</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 身分証選択部分 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">身分証明書を選択</h3>
              <IdTypeSelector 
                selectedIdType={selectedIdType} 
                onSelectIdType={handleSelectIdType} 
              />
            </div>
            
            {/* 撮影ボタン */}
            {!capturedImage ? (
              <button
                onClick={handleStartCamera}
                disabled={!selectedIdType}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg mt-2 mb-4 flex items-center justify-center ${selectedIdType ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}
              >
                <span className="mr-2">📷</span> 身分証明書を撮影する
              </button>
            ) : (
              <div className="bg-green-100 p-4 rounded-lg flex items-center mb-4">
                <HiCheckCircle className="text-green-500 text-xl mr-2" />
                <p>写真の撮影が完了しました</p>
              </div>
            )}
            
            {/* 注意事項 */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <HiQuestionMarkCircle className="text-yellow-500 mr-2" />
                注意事項
              </h3>
              
              <div className="text-sm space-y-2 text-gray-600">
                <p>・ 身分証明書の全体がはっきり写るように撮影してください</p>
                <p>・ 書類の<span className="font-bold text-red-500">有効期限</span>が１ヶ月以上残っているものをご利用ください</p>
                <p>・ 健康保険証を使用する場合は、個人情報（記号・番号・枠・保険者番号・QRコード）をマスキングしてください</p>
              </div>
            </div>
            
            {/* 生年月日確認 */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-3">生年月日の確認</h3>
              <p className="text-sm text-gray-600 mb-3">身分証明書に記載されている生年月日と同じか確認してください</p>
              
              <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                <input 
                  type="date" 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <p className="text-xs text-red-500 mt-1">提出する身分証と完全に一致しないと審査に通過しません</p>
            </div>
            
            {/* 送信ボタン */}
            <button
              onClick={handleSubmit}
              disabled={!capturedImage || isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg mb-4 ${capturedImage && !isSubmitting ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}
            >
              {isSubmitting ? '送信中...' : '送信して完了'}
            </button>
            
            {/* 補足情報 */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <span className="text-gray-600">🔒</span>
                </div>
              </div>
              
              <p className="text-center text-sm mb-4">
                お客様の個人情報は個人情報保護法に基づき
                厳正な管理、適正な取り扱いを行っております
              </p>
              
              <div className="text-xs text-center mt-4">
                <ul className="space-y-1 text-gray-500">
                  <li>・ 審査は10分ほどで完了します</li>
                  <li>・ 審査が完了しましたら、マイページ内「お知らせ」にて結果を連絡します</li>
                  <li>・ 再提出をお願いする場合があります</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// カメラビューコンポーネント
const CameraView = ({ onCapture }: { onCapture: () => void }) => {
  return (
    <div className="w-full">
      {/* 撮影画面 */}
      <div className="aspect-[3/4] w-full bg-black rounded-lg mb-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <p>カメラアクセスが許可されていません</p>
            <p className="text-sm">実際のアプリでは、ここにカメラプレビューが表示されます</p>
          </div>
        </div>
        
        {/* 撮影指定のオーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="border-2 border-dashed border-white w-full h-full rounded-lg"></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm mb-4">
          書類全体がハッキリ写るように
          撮影してください
        </p>
        
        <button
          onClick={onCapture}
          className="w-16 h-16 bg-white rounded-full border-4 border-teal-500 mx-auto"
        ></button>
      </div>
    </div>
  );
};

// IDタイプ選択コンポーネント
const IdTypeSelector = ({ 
  selectedIdType, 
  onSelectIdType 
}: { 
  selectedIdType: string | null; 
  onSelectIdType: (type: string) => void; 
}) => {
  // 身分証の種類
  const idTypes = [
    { id: 'drivers_license', name: '運転免許証', icon: '🛤️' },
    { id: 'health_insurance', name: '健康保険証', icon: '💻' },
    { id: 'my_number', name: 'マイナンバー', icon: '📝' },
    { id: 'passport', name: 'パスポート', icon: '🛂️' },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {idTypes.map((type) => (
          <div 
            key={type.id}
            className={`rounded-lg border p-4 flex flex-col items-center ${selectedIdType === type.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}
            onClick={() => onSelectIdType(type.id)}
          >
            <div className="text-3xl mb-2">{type.icon}</div>
            <p className="text-center text-sm">{type.name}</p>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-center mb-2">
        住民基本台帳カード / 在留カード / 特別永住者許可証 も
        ご利用いただけます
      </p>
    </div>
  );
};



export default AgeVerificationPage;
