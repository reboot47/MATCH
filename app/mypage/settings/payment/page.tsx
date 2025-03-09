"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiCreditCard, HiPlus } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

type CreditCard = {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'diners' | 'jcb';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export default function PaymentSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? true; // デフォルトは男性ユーザー
  
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // フォーム状態
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // 実際のアプリではAPIからカード情報を取得
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 女性ユーザーの場合はカード情報を表示しない
        if (!isMale) {
          setCards([]);
          return;
        }
        
        // モックデータ
        const mockCards: CreditCard[] = [
          {
            id: 'card_1',
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
            isDefault: true
          }
        ];
        
        setCards(mockCards);
      } catch (error) {
        console.error('カード情報の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [isMale]);

  const handleCardDelete = (cardId: string) => {
    // 実際のアプリではAPIを呼び出してカード削除
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleSetDefault = (cardId: string) => {
    // 実際のアプリではAPIを呼び出してデフォルトカード設定
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!cardNumber || !cardName || !expDate || !cvc) {
      setFormError('すべての項目を入力してください');
      return;
    }
    
    // カード番号の形式チェック
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setFormError('有効なカード番号を入力してください');
      return;
    }
    
    // 有効期限の形式チェック
    if (!/^\d{2}\/\d{2}$/.test(expDate)) {
      setFormError('有効期限の形式が正しくありません（MM/YY）');
      return;
    }
    
    // CVCの形式チェック
    if (!/^\d{3,4}$/.test(cvc)) {
      setFormError('有効なセキュリティコードを入力してください');
      return;
    }
    
    // 実際のアプリではAPIを呼び出してカード追加
    const [month, year] = expDate.split('/');
    const newCard: CreditCard = {
      id: `card_${Date.now()}`,
      brand: 'visa', // 仮でVISAとする
      last4: cardNumber.slice(-4),
      expMonth: parseInt(month, 10),
      expYear: 2000 + parseInt(year, 10),
      isDefault: cards.length === 0 // 最初のカードならデフォルト
    };
    
    setCards([...cards, newCard]);
    setShowAddCard(false);
    
    // フォームリセット
    setCardNumber('');
    setCardName('');
    setExpDate('');
    setCvc('');
    setFormError('');
  };

  // カード番号の表示時にフォーマットする
  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };

  // カードブランドのロゴを取得
  const getCardBrandLogo = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳 VISA';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 American Express';
      case 'diners':
        return '💳 Diners Club';
      case 'jcb':
        return '💳 JCB';
      default:
        return '💳';
    }
  };

  // ユーザーの性別に応じたカードセクションのタイトルを設定
  const cardSectionTitle = isMale ? 'クレジットカード登録情報変更' : 'クレジットカード登録（ポイント受け取り用）';

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
        <h1 className="text-center flex-grow font-medium text-lg">{cardSectionTitle}</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-4">
          {!isMale && (
            <div className="bg-pink-50 p-4 rounded-lg mb-4 text-center border border-pink-200">
              <p className="text-gray-700 mb-2">ポイント収入の受け取りに使用されます</p>
              <p className="text-sm text-gray-600">男性会員からのギフトやいいねなどによるポイント収入を受け取るために登録できます。登録は任意です。</p>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              {/* 登録済みカード一覧 */}
              {cards.length > 0 && !showAddCard && (
                <div className="bg-white rounded-lg shadow-sm mb-4">
                  <h2 className="px-4 py-3 border-b border-gray-100 font-medium">登録済みのカード</h2>
                  
                  <div className="divide-y divide-gray-100">
                    {cards.map(card => (
                      <div key={card.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{getCardBrandLogo(card.brand)}</span>
                            <span className="ml-2 text-gray-600">****{card.last4}</span>
                            {card.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                                デフォルト
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {card.expMonth.toString().padStart(2, '0')}/{card.expYear % 100}
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 text-sm">
                          {!card.isDefault && (
                            <button 
                              onClick={() => handleSetDefault(card.id)}
                              className="text-teal-500 hover:text-teal-600"
                            >
                              デフォルトにする
                            </button>
                          )}
                          <button 
                            onClick={() => handleCardDelete(card.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* カード追加フォーム */}
              {showAddCard ? (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-medium mb-4">新しいカードを追加</h2>
                  
                  <form onSubmit={handleAddCard}>
                    {formError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {formError}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カード番号
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カード名義(半角ローマ字)
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="TARO YAMADA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="flex space-x-4 mb-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          有効期限 (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={expDate}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (value.length === 2 && !value.includes('/') && expDate.length === 1) {
                              value += '/';
                            }
                            if (value.length <= 5) {
                              setExpDate(value);
                            }
                          }}
                          placeholder="12/25"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          セキュリティコード (CVC)
                        </label>
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 4) {
                              setCvc(val);
                            }
                          }}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-6">
                      ※ JCBのカードはお取り扱いしておりません。
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCard(false);
                          setFormError('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
                      >
                        キャンセル
                      </button>
                      
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                      >
                        カードを登録する
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center justify-center w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  <HiPlus className="mr-2" />
                  新しいカードを追加
                </button>
              )}
              
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <div className="flex items-center text-gray-600 mb-2">
                  <HiCreditCard className="mr-2" />
                  <span className="font-medium">安心・安全なお支払いについて</span>
                </div>
                <p className="text-sm text-gray-500">
                  当社は個人情報について適切な保護措置を講じ、適法、適正に取得、利用、管理をしている企業として、第三者機関JAPHIC(ジャフィック)の認証を受けております。
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
