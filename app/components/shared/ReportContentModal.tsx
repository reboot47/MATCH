"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: 'profile' | 'photo' | 'message' | 'livestream' | 'other';
  userId?: string;
  username?: string;
}

// 報告理由のオプション
const reportReasons = {
  profile: [
    '不適切なプロフィールコンテンツ',
    '虚偽情報',
    '年齢詐称',
    'なりすまし',
    '規約違反',
    'その他'
  ],
  photo: [
    '不適切な写真',
    '露出が多すぎる',
    '暴力的な内容',
    '権利侵害',
    '無関係な写真',
    'その他'
  ],
  message: [
    '迷惑メッセージ',
    '外部連絡先の要求',
    '金銭要求',
    '脅迫/嫌がらせ',
    '不適切な誘い',
    'その他'
  ],
  livestream: [
    '不適切なコンテンツ',
    '露出が多すぎる',
    '暴力的な内容',
    '権利侵害',
    '誤解を招く内容',
    'その他'
  ],
  other: [
    '迷惑行為',
    '規約違反',
    'なりすまし',
    '不適切な行動',
    'その他'
  ]
};

const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentType,
  userId,
  username
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // モーダルのリセット
  const resetModal = () => {
    setSelectedReason(null);
    setDetails('');
    setStep(1);
    setIsSubmitting(false);
  };
  
  // 閉じるハンドラー
  const handleClose = () => {
    resetModal();
    onClose();
  };
  
  // 報告を送信
  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('報告理由を選択してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // ここで実際のAPI呼び出しを行う
      // const response = await fetch('/api/report-content', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     contentId,
      //     contentType,
      //     userId,
      //     reason: selectedReason,
      //     details
      //   })
      // });
      
      // if (!response.ok) throw new Error('報告の送信に失敗しました');
      
      // モック成功レスポンス
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('報告を受け付けました。ご協力ありがとうございます。');
      handleClose();
    } catch (error) {
      console.error('報告エラー:', error);
      toast.error('報告の送信に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 理由によって次のステップへ
  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setStep(2);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">コンテンツを報告</h3>
              <p className="text-sm text-gray-500 mt-1">
                {contentType === 'profile' && 'このプロフィールを報告する理由をお選びください'}
                {contentType === 'photo' && 'この写真を報告する理由をお選びください'}
                {contentType === 'message' && 'このメッセージを報告する理由をお選びください'}
                {contentType === 'livestream' && 'この配信を報告する理由をお選びください'}
                {contentType === 'other' && 'このコンテンツを報告する理由をお選びください'}
              </p>
              {username && (
                <p className="text-sm font-medium text-gray-700 mt-1">
                  ユーザー: {username}
                </p>
              )}
            </div>

            <div className="p-5">
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 mb-2">報告理由を選択してください:</p>
                  {reportReasons[contentType].map((reason) => (
                    <motion.button
                      key={reason}
                      className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      whileHover={{ x: 5 }}
                      onClick={() => handleReasonSelect(reason)}
                    >
                      {reason}
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">選択した理由:</p>
                    <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm">
                      {selectedReason}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      詳細情報 (任意):
                    </label>
                    <textarea
                      className="w-full h-24 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="問題についての詳細を記入してください..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-between">
              {step === 1 ? (
                <>
                  <button
                    className="px-4 py-2 rounded-md text-gray-600 text-sm hover:bg-gray-100"
                    onClick={handleClose}
                  >
                    キャンセル
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
                    disabled
                  >
                    続ける
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 rounded-md text-gray-600 text-sm hover:bg-gray-100"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    戻る
                  </button>
                  <button
                    className={`px-4 py-2 bg-red-600 text-white rounded-md text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        送信中...
                      </span>
                    ) : (
                      '報告を送信'
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportContentModal;
