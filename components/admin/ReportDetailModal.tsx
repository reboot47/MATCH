import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AdminReportWithUsers } from '../../lib/api/admin';
import Image from 'next/image';

interface ReportDetailModalProps {
  report: AdminReportWithUsers | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, action: string) => Promise<void>;
  onSaveMemo: (id: string, memo: string) => void;
}

export default function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onStatusChange,
  onSaveMemo
}: ReportDetailModalProps) {
  if (!report) return null;

  const [showActions, setShowActions] = useState(false);
  const [memo, setMemo] = useState(report.adminMemo || '');
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  // 証拠画像があるかどうかを確認
  const hasEvidence = report.evidenceUrls && report.evidenceUrls.length > 0;

  // ステータスを日本語に変換
  const statusText = {
    'pending': '保留中',
    'investigating': '調査中',
    'resolved': '解決済み',
    'rejected': '却下'
  }[report.status] || report.status;

  // 重大度を日本語に変換
  const severityText = {
    'low': '低',
    'medium': '中',
    'high': '高',
    'critical': '最高'
  }[report.severity] || report.severity;

  // 違反タイプを日本語に変換
  const typeText = {
    'inappropriate_content': '不適切なコンテンツ',
    'spam': 'スパム',
    'harassment': '嫌がらせ',
    'fake_account': '偽アカウント',
    'other': 'その他'
  }[report.type] || report.type;

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(report.id.toString(), newStatus);
    setShowActions(false);
  };

  const handleSaveMemo = () => {
    setIsSavingMemo(true);
    onSaveMemo(report.id.toString(), memo);
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center gap-2">
                    <span>違反報告詳細</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      report.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {statusText}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      重大度: {severityText}
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
                      <h4 className="font-semibold text-sm text-gray-500">報告タイプ</h4>
                      <p>{typeText}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500">報告日時</h4>
                      <p>{new Date(report.createdAt).toLocaleString('ja-JP')}</p>
                    </div>
                  </div>
                  
                  {/* 報告者と報告対象者 */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">報告者</h4>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {report.reporter?.image ? (
                            <Image
                              src={report.reporter.image}
                              alt={report.reporter.name || '報告者'}
                              className="rounded-full"
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">{(report.reporter?.name || '?')[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{report.reporter?.name || '不明'}</p>
                          <p className="text-xs text-gray-500">{report.reporter?.email || '不明'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">報告対象者</h4>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {report.reported?.image ? (
                            <Image
                              src={report.reported.image}
                              alt={report.reported.name || '報告対象者'}
                              className="rounded-full"
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">{(report.reported?.name || '?')[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{report.reported?.name || '不明'}</p>
                          <p className="text-xs text-gray-500">{report.reported?.email || '不明'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 詳細説明 */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 mb-1">報告内容</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{report.description}</p>
                  </div>
                  
                  {/* 証拠画像 */}
                  {hasEvidence && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">証拠画像</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {report.evidenceUrls.map((url, index) => (
                          <div key={index} className="relative h-24 border rounded">
                            <Image
                              src={url}
                              alt={`証拠 ${index + 1}`}
                              width={100}
                              height={96}
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              className="rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 解決内容 */}
                  {report.resolution && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1">解決内容</h4>
                      <p className="text-sm bg-green-50 p-3 rounded">{report.resolution}</p>
                    </div>
                  )}
                  
                  {/* 管理者メモ */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">管理者メモ</h4>
                    <div className="flex flex-col space-y-2">
                      <textarea
                        className="border rounded-md p-2 text-sm"
                        rows={3}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="この報告に関する管理者メモを入力してください"
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
                      {report.adminMemo && memo !== report.adminMemo && (
                        <p className="text-xs text-amber-600">* 変更は保存ボタンを押すまで反映されません</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
                  {report.status !== 'investigating' && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(report.id.toString(), 'investigate')}
                      className="px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 rounded-md hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                    >
                      調査中にする
                    </button>
                  )}
                  
                  {report.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(report.id.toString(), 'resolve')}
                      className="px-4 py-2 text-sm font-medium text-green-900 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      解決済みにする
                    </button>
                  )}
                  
                  {report.status === 'resolved' && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(report.id.toString(), 'reopen')}
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      再開する
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
