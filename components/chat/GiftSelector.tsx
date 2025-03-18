import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { useUser } from '@/components/UserContext';
import { X, Gift as GiftIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { MouseEvent, ChangeEvent, FormEvent } from 'react';
import type { ReactElement } from 'react';
import { validateImageUrl } from '@/app/utils/imageHelpers';
import GiftImage from '@/app/components/common/GiftImage';

type GiftSelectorContext = {
  type: 'chat' | 'video' | 'live';
  chatId?: string;
  roomId?: string;
};

interface GiftSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gift: Gift, message: string) => void;
  context: GiftSelectorContext;
  onSend?: (gift: Gift, message: string) => void;
}

const GiftSelector = ({
  isOpen,
  onClose,
  onSelect,
  context,
  onSend,
}: GiftSelectorProps): ReactElement => {
  const { user } = useUser();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // コンポーネントのマウント解除時にリソースをクリーンアップ
  useEffect(() => {
    return () => {
      setGifts([]);
      setSelectedGift(null);
      setMessage('');
      setError('');
    };
  }, []);

  // ギフト一覧を取得
  useEffect(() => {
    const fetchGifts = async (): Promise<void> => {
      try {
        // APIが実装されるまでモックデータを使用
        const mockGifts: Gift[] = [
          {
            id: '1',
            name: 'ハート',
            description: 'お相手への気持ちを伝える',
            price: 100,
            imageUrl: '/images/gifts/heart.svg', // SVG形式を使用
            category: 'chat',
            animation: 'hearts' // ハートが流れるアニメーション
          },
          {
            id: '2',
            name: '花束',
            description: '特別な日に送りましょう',
            price: 300,
            imageUrl: '/images/gifts/flowers.svg', // SVG形式を使用
            category: 'all',
            animation: 'sparkle' // キラキラ光るアニメーション
          },
          {
            id: '3',
            name: 'ケーキ',
            description: 'お祈りと感謝の気持ちを込めて',
            price: 500,
            imageUrl: '/images/gifts/cake.svg', // SVG形式を使用
            category: 'chat',
            animation: 'sparkle' // キラキラ光るアニメーション
          },
          {
            id: '4',
            name: 'ロマンチックディナー',
            description: 'あなたを特別なディナーに招待します',
            price: 1000,
            imageUrl: '/images/gifts/dinner.svg', // SVG形式を使用
            category: 'all',
            animation: 'luxury' // 高級感のあるアニメーション
          },
          {
            id: '5',
            name: '高級ワイン',
            description: '最高のワインで乾杯しましょう',
            price: 2000,
            imageUrl: '/images/gifts/wine.svg', // SVG形式を使用
            category: 'all'
          }
        ];
        
        // モックデータを設定
        setGifts(mockGifts);
      } catch (error) {
        setError((error as Error)?.message || 'エラーが発生しました');
      }
    };

    if (isOpen) {
      void fetchGifts();
    }
  }, [isOpen]);

  // user情報が取得できない場合でもモックで表示するように修正
  if (!isOpen) {
    return <div className="hidden" aria-hidden="true" />;
  }

  const handleGiftClick = (gift: Gift): void => {
    setSelectedGift(gift);
    setError('');
  };

  // ポイントの確認とギフト送信の処理を行う
  const handleGiftSend = async (selectedGift: Gift, message: string): Promise<void> => {
    if (!selectedGift) {
      console.error('【エラー】ギフトが選択されていません');
      setError('ギフトが選択されていません');
      return;
    }

    console.log('【ギフト送信】処理開始:', { 
      giftId: selectedGift.id,
      giftName: selectedGift.name, 
      originalImageUrl: selectedGift.imageUrl,
      hasImageUrl: !!selectedGift.imageUrl,
      imageUrlType: typeof selectedGift.imageUrl,
      hasAnimation: !!selectedGift.animation,
      message: message
    });

    try {
      // APIが実装されるまでは全て成功したとみなして処理を続行
      // 正常動作確認用のモック実装
      
      // ギフト添付ファイルを作成してメッセージとして送信
      // 画像URLのバリデーションにヘルパー関数を使用
      console.log('【ギフト画像処理前】', {
        ギフトID: selectedGift.id,
        ギフト名: selectedGift.name,
      });
      
      // 常に確実なパスを使用する
      let giftImageUrl = '/images/gifts/default-gift.png'; // PNGファイルを使用
      
      // IDに基づいて直接パスを決定する（エラーリスクを最小化）
      try {
        switch (selectedGift.id) {
          case '1':
            giftImageUrl = '/images/gifts/heart.png';
            break;
          case '2':
            giftImageUrl = '/images/gifts/flowers.png';
            break;
          case '3':
            giftImageUrl = '/images/gifts/cake.png';
            break;
          case '4':
            giftImageUrl = '/images/gifts/dinner.png';
            break;
          case '5':
            giftImageUrl = '/images/gifts/wine.png';
            break;
          default:
            // IDが想定外の場合はデフォルトを使用
            console.log(`未知のギフトID: ${selectedGift.id}, デフォルト画像を使用します`);
            giftImageUrl = '/images/gifts/default-gift.png?v=20250318';
        }
      } catch (error) {
        console.error('ギフト画像URL処理中にエラーが発生しました:', error);
        giftImageUrl = '/images/gifts/default-gift.png?v=20250318';
      }
      
      // 最終確認 - これは重要
      if (giftImageUrl === '') {
        console.error('【緊急エラー】空の画像URLが検出されました。プレースホルダーを強制設定します。');
        giftImageUrl = '/images/gifts/default-gift.png?v=20250318';
      }
      
      console.log('【ギフト画像処理後】', {
        最終的な画像URL: giftImageUrl,
        タイプ: typeof giftImageUrl,
        空かどうか: giftImageUrl === ''
      });
        
      // 最終確認 - URLが有効か確認
      if (!giftImageUrl || giftImageUrl === '') {
        console.warn('無効な画像URLを検出、デフォルト画像を使用します');
        giftImageUrl = '/images/gifts/default-gift.png?v=20250318';
      }
      
      // 絶対パスに変換して確実性を高める
      const absoluteImageUrl = giftImageUrl.startsWith('/') 
        ? window.location.origin + giftImageUrl 
        : giftImageUrl;
        
      console.log('【最終確認】絶対パスに変換した画像URL:', absoluteImageUrl);
      
      // ギフトアタッチメントオブジェクトを作成
      const giftAttachment = {
        id: `gift-${Date.now()}`,
        type: 'gift',
        createdAt: new Date(),
        giftId: selectedGift.id,
        giftName: selectedGift.name,
        giftImageUrl: absoluteImageUrl, // 絶対パスに変換した画像URL
        url: absoluteImageUrl, // ChatMessage コンポーネントとの互換性のため
        price: selectedGift.price,
        message: message || 'お引き立てありがとうございます', // デフォルトメッセージを設定
        animation: selectedGift.animation
      };
      
      // ローカルストレージにキャッシュして確実に保存
      try {
        const recentGifts = JSON.parse(localStorage.getItem('recentGifts') || '[]');
        recentGifts.unshift(giftAttachment);
        if (recentGifts.length > 10) recentGifts.pop(); // 最大10個まで保存
        localStorage.setItem('recentGifts', JSON.stringify(recentGifts));
      } catch (err) {
        console.error('ギフトキャッシュの保存に失敗しました', err);
      }
      
      // デバッグ用に確認ログを出力
      console.log('【送信データ】ギフトアタッチメント:', giftAttachment);
      console.log('【検証】giftImageUrlの値:', giftAttachment.giftImageUrl);
      console.log('【検証】giftImageUrlのタイプ:', typeof giftAttachment.giftImageUrl);
      console.log('【検証】giftImageUrlは空文字列か:', giftAttachment.giftImageUrl === '');
      
      // 成功時は選択したギフトとメッセージを返す
      console.log('【処理】onSelect関数を呼び出し中...');
      onSelect(selectedGift, message);
      
      // メッセージ送信機能が実装されていれば、ギフトの添付ファイルも一緒に送信する
      if (onSend) {
        console.log('【処理】onSend関数を呼び出し中...');
        onSend(selectedGift, message);
      }
      
      onClose();
    } catch (error) {
      setError((error as Error)?.message || 'エラーが発生しました');
    }
  };





  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!selectedGift) {
      setError('ギフトを選択してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await handleGiftSend(selectedGift, message);
      onClose();
    } catch (error) {
      setError((error as Error)?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 sm:p-6"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-selector-title"
            aria-describedby="gift-selector-description"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 id="gift-selector-title" className="text-lg font-bold text-gray-900">ギフトを贈る</h3>
                <p id="gift-selector-description" className="sr-only">ギフトを選択して送信することができます</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="ギフト選択を閉じる"
              >
                <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <div 
              className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6 max-h-60 overflow-y-auto" 
              role="listbox"
              aria-label="ギフト一覧"
            >
              {gifts.map((gift) => (
                <button
                  type="button"
                  key={gift.id}
                  onClick={() => handleGiftClick(gift)}
                  className={twMerge(
                    'p-2 rounded-lg border flex flex-col items-center justify-center gap-2',
                    selectedGift?.id === gift.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                  )}
                  role="option"
                  aria-selected={selectedGift?.id === gift.id}
                  disabled={loading}
                  aria-label={`ギフト: ${gift.name}、ポイント: ${gift.price}`}
                >
                  <div className="aspect-square relative mb-2 w-16 h-16 border rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-sm">
                    <GiftImage 
                      src={gift.imageUrl || `/images/gifts/${gift.id}.png?v=20250318`}
                      alt={gift.name}
                      giftName={gift.name}
                      width={64}
                      height={64}
                      showLineStyle={true}
                      previewMode={true}
                      priority={false}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {gift.name}
                    </p>
                    <p className="text-xs text-primary-600">
                      {gift.price}ポイント
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex flex-col gap-3 mb-4">
                {selectedGift && (
                  <div className="mb-2">
                    <label htmlFor="gift-message" className="block text-sm font-medium text-gray-700 mb-1">
                      メッセージを添える（任意・50文字まで）
                    </label>
                    <input
                      id="gift-message"
                      type="text"
                      value={message}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                      maxLength={50}
                      placeholder="メッセージを入力"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    disabled={loading}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedGift || loading}
                    className={twMerge(
                      'px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2',
                      !selectedGift || loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    )}
                    aria-label={loading ? '送信中' : 'ギフトを送る'}
                  >
                    <GiftIcon className="w-4 h-4" aria-hidden="true" />
                    <span>{loading ? '送信中...' : 'ギフトを贈る'}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftSelector;
