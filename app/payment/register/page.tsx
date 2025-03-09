"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';
import Image from 'next/image';

const PaymentRegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvc: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 実際には正しくバリデーションと安全な送信処理を行います
    // ここではモックの処理として成功後のリダイレクトのみ実装
    alert('支払い情報が登録されました');
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiArrowLeft className="text-gray-700 text-xl" />
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">お支払い情報登録</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">クレジットカード情報</h2>
          
          <form onSubmit={handleSubmit}>
            {/* メールアドレス */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 mr-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="メールアドレス"
                  required
                />
                <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
                  <span className="text-gray-700">@me.com</span>
                </div>
              </div>
            </div>
            
            {/* カード情報 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カード情報 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center mb-2">
                <Image src="/images/visa.png" alt="Visa" width={32} height={20} className="mr-1" />
                <Image src="/images/mastercard.png" alt="Mastercard" width={32} height={20} className="mr-1" />
                <Image src="/images/amex.png" alt="American Express" width={32} height={20} className="mr-1" />
                <Image src="/images/diners.png" alt="Diners Club" width={32} height={20} />
              </div>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="カード番号"
                required
              />
              <p className="text-xs text-red-500 mb-2">※ JCBのカードはお取り扱いしておりません</p>
              
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="カード名義人（半角ローマ字）"
                required
              />
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM(月)/YY(年)"
                  required
                />
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="セキュリティコード(CVC)"
                  required
                />
              </div>
            </div>
            
            {/* 認証マーク */}
            <div className="flex items-center justify-center my-6">
              <Image src="/images/japhic.png" alt="JAPHIC" width={40} height={40} className="mr-2" />
              <div className="text-xs text-gray-600 max-w-xs">
                当社は個人情報について適切な保護措置を講ずる体制を整備、運用、管理している企業として、第三者機関であるJAPHIC（ジャフィック）の認定を受けております。
              </div>
            </div>
            
            {/* 登録ボタン */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              登録する
            </button>
          </form>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">注意事項</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>ご本人様の決済であると確認ができない場合は利用制限をかけさせていただく場合がございます。予めご了承ください。</li>
            <li>明細名は「paters」または「amica」「SKGroup」のいずれかにて表記されます。カード会社毎に明細名が異なりますのでご了承ください。</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PaymentRegisterPage;
