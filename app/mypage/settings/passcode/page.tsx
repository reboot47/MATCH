"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

export default function PasscodeSettingsPage() {
  const router = useRouter();
  const userContext = useUser();
  
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  
  useEffect(() => {
    // 実際のアプリではAPIからパスコード設定を取得
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // モックデータ - デフォルトはOFF
        setIsPasscodeEnabled(false);
        setIsFaceIDEnabled(false);
      } catch (error) {
        console.error('設定の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleTogglePasscode = async () => {
    if (!isPasscodeEnabled) {
      // パスコードが無効で、これから有効にする場合はモーダルを表示
      setShowPasscodeModal(true);
    } else {
      // パスコードを無効にする場合
      try {
        // API呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 設定を更新
        setIsPasscodeEnabled(false);
        
        // Face IDも無効にする
        setIsFaceIDEnabled(false);
      } catch (error) {
        console.error('設定の更新に失敗しました', error);
      }
    }
  };

  const handleToggleFaceID = async () => {
    // パスコードが有効な場合のみFace IDを切り替え可能
    if (!isPasscodeEnabled) return;
    
    try {
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // トグル状態を更新
      setIsFaceIDEnabled(!isFaceIDEnabled);
    } catch (error) {
      console.error('設定の更新に失敗しました', error);
    }
  };

  // パスコード設定モーダル（簡易的な実装）
  const PasscodeModal = () => {
    const [passcode, setPasscode] = useState(['', '', '', '']);
    const [confirmPasscode, setConfirmPasscode] = useState(['', '', '', '']);
    const [step, setStep] = useState('enter'); // 'enter' or 'confirm'
    const [error, setError] = useState('');
    
    const handlePasscodeInput = (value: string, index: number) => {
      if (step === 'enter') {
        const newPasscode = [...passcode];
        newPasscode[index] = value;
        setPasscode(newPasscode);
        
        // 4桁すべて入力されたら確認ステップへ
        if (newPasscode.every(digit => digit !== '')) {
          setTimeout(() => {
            setStep('confirm');
          }, 300);
        }
      } else {
        const newConfirm = [...confirmPasscode];
        newConfirm[index] = value;
        setConfirmPasscode(newConfirm);
        
        // 確認用の4桁すべて入力されたら検証
        if (newConfirm.every(digit => digit !== '')) {
          setTimeout(() => {
            if (passcode.join('') === newConfirm.join('')) {
              // パスコード設定成功
              setIsPasscodeEnabled(true);
              setShowPasscodeModal(false);
            } else {
              // パスコードが一致しない
              setError('パスコードが一致しません。もう一度お試しください。');
              setConfirmPasscode(['', '', '', '']);
            }
          }, 300);
        }
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
          <h2 className="text-xl font-medium text-center mb-6">
            {step === 'enter' ? 'パスコードを設定' : 'パスコードを確認'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mb-8">
            {(step === 'enter' ? passcode : confirmPasscode).map((digit, i) => (
              <div 
                key={i} 
                className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-medium"
              >
                {digit ? '●' : ''}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, index) => (
              <button
                key={num}
                className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium text-gray-800 focus:outline-none focus:bg-gray-200"
                onClick={() => {
                  const currentArray = step === 'enter' ? passcode : confirmPasscode;
                  const emptyIndex = currentArray.findIndex(d => d === '');
                  if (emptyIndex !== -1) {
                    handlePasscodeInput(num.toString(), emptyIndex);
                  }
                }}
                style={{ gridColumn: num === 0 ? '2 / 3' : 'auto' }}
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
              onClick={() => {
                if (step === 'enter') {
                  setShowPasscodeModal(false);
                } else {
                  setStep('enter');
                  setConfirmPasscode(['', '', '', '']);
                  setError('');
                }
              }}
            >
              {step === 'enter' ? 'キャンセル' : '戻る'}
            </button>
            
            {step === 'enter' && (
              <button
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
                onClick={() => setPasscode(['', '', '', ''])}
              >
                クリア
              </button>
            )}
          </div>
        </div>
      </div>
    );
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
        <h1 className="text-center flex-grow font-medium text-lg">パスコード設定</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-gray-700">パスコード設定</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-passcode"
                      checked={isPasscodeEnabled}
                      onChange={handleTogglePasscode}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-passcode"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        isPasscodeEnabled ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                          isPasscodeEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-gray-700">Face IDでロック解除</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-face-id"
                      checked={isFaceIDEnabled}
                      onChange={handleToggleFaceID}
                      disabled={!isPasscodeEnabled}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-face-id"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        !isPasscodeEnabled ? 'bg-gray-200 cursor-not-allowed' :
                        isFaceIDEnabled ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                          isFaceIDEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-sm text-gray-600">
                <p className="mb-2">4ケタのパスコードを設定することで、アプリを開く際にロックをかけることができます。</p>
                <p className="mb-2">ログアウトするか、再設定をオフにした上で、再度オンにするとパスコードをリセットできます。</p>
                <p>Face IDでロック解除をオンにすることで、パスコードとFace IDのどちらかでロックを解除することができます。</p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* パスコード設定モーダル */}
      {showPasscodeModal && (
        <PasscodeModal />
      )}
    </div>
  );
}
