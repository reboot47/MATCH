import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AdminMessageWithUsers } from '../../lib/api/admin';
import Image from 'next/image';

interface MessageDetailModalProps {
  message: AdminMessageWithUsers | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, action: string) => Promise<void>;
  onSaveMemo: (id: string, memo: string) => void;
}

export default function MessageDetailModal({
  message,
  isOpen,
  onClose,
  onStatusChange,
  onSaveMemo
}: MessageDetailModalProps) {
  if (!message) return null;

  const [actionType, setActionType] = useState('');
  const [memo, setMemo] = useState(message.adminMemo || '');
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  const handleStatusChange = (action: string) => {
    onStatusChange(message.id, action);
    setActionType('');
  };

  const handleSaveMemo = () => {
    setIsSavingMemo(true);
    onSaveMemo(message.id, memo);
    setTimeout(() => {
      setIsSavingMemo(false);
    }, 1000);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center gap-2">
                    <span>メッセージ詳細</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      message.isFlagged ? 'bg-yellow-100 text-yellow-800' : 
                      message.isBlocked ? 'bg-red-100 text-red-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {message.isFlagged ? 'フラグあり' : 
                       message.isBlocked ? 'ブロック済み' : 
                       '正常'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">閉じる</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  {/* 基本情報 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500">メッセージID</h4>
                      <p>{message.id}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500">送信日時</h4>
                      <p>{new Date(message.createdAt).toLocaleString('ja-JP')}</p>
                    </div>
                  </div>
                  
                  {/* 送信者と受信者 */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">送信者</h4>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {message.sender?.image ? (
                            <Image
                              src={message.sender.image}
                              alt={message.sender.name || '送信者'}
                              className="rounded-full"
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">{(message.sender?.name || '?')[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{message.sender?.name || '不明'}</p>
                          <p className="text-xs text-gray-500">{message.sender?.email || '不明'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">受信者</h4>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {message.receiver?.image ? (
                            <Image
                              src={message.receiver.image}
                              alt={message.receiver.name || '受信者'}
                              className="rounded-full"
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">{(message.receiver?.name || '?')[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{message.receiver?.name || '不明'}</p>
                          <p className="text-xs text-gray-500">{message.receiver?.email || '不明'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* メッセージ内容 */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 mb-1">メッセージ内容</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* ブロック理由 */}
                  {message.isBlocked && message.blockReason && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1">ブロック理由</h4>
                      <p className="text-sm bg-red-50 p-3 rounded">{message.blockReason}</p>
                    </div>
                  )}
                  
                  {/* 管理者メモ */}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      管理者メモ
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex flex-col space-y-2">
                        <textarea
                          className="border rounded-md p-2 text-sm"
                          rows={3}
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                          placeholder="このメッセージに関する管理者メモを入力してください"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSaveMemo}
                          >
                            {isSavingMemo ? '保存中...' : 'メモを保存'}
                          </button>
                        </div>
                        {message.adminMemo && memo !== message.adminMemo && (
                          <p className="text-xs text-amber-600">* 変更は保存ボタンを押すまで反映されません</p>
                        )}
                      </div>
                    </dd>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
                  {!message.isFlagged && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(message.id, 'flag')}
                      className="px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 rounded-md hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                    >
                      フラグを付ける
                    </button>
                  )}
                  
                  {message.isFlagged && !message.isBlocked && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(message.id, 'unflag')}
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      フラグを解除
                    </button>
                  )}
                  
                  {!message.isBlocked && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(message.id, 'block')}
                      className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      ブロックする
                    </button>
                  )}
                  
                  {message.isBlocked && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(message.id, 'unblock')}
                      className="px-4 py-2 text-sm font-medium text-green-900 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      ブロック解除
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
