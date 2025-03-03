"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminReports, updateAdminReport, deleteAdminReport, updateAdminReportMemo, AdminReportWithUsers } from '../../../lib/api/admin';
import { toast } from 'react-hot-toast';
import { withAdminAuth } from '../../../components/auth/withAdminAuth';
import ReportDetailModal from '../../../components/admin/ReportDetailModal';

interface Report {
  id: number;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  severity: string;
  resolution?: string;
  evidenceUrls: string[];
  notes?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// 報告・違反管理ページ
function ReportsPage() {
  // 状態管理
  const [reports, setReports] = useState<AdminReportWithUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  // 詳細モーダル表示のための状態
  const [selectedReport, setSelectedReport] = useState<AdminReportWithUsers | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // フィルタ状態
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    search: '',
  });

  // データ読み込み
  useEffect(() => {
    loadReports();
  }, [filters, pagination.page]);

  // 報告データを読み込む
  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminReports({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || undefined,
        severity: filters.severity || undefined,
        search: filters.search || undefined
      });

      setReports(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        pages: response.pagination.pages
      });
    } catch (err) {
      console.error('報告データの読み込みに失敗しました:', err);
      setError('報告データの読み込みに失敗しました。再度お試しください。');
      toast.error('報告データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ステータス変更処理
  const handleStatusChange = async (id: string, status: string) => {
    setLoading(true);
    try {
      await updateAdminReport(id, { status });
      toast.success(`報告のステータスが "${status}" に更新されました`);
      
      // データを再読み込み
      loadReports();
    } catch (error) {
      console.error('Error updating report status:', error);
      toast.error('報告の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // メモ保存処理
  const handleSaveMemo = async (id: string, memo: string) => {
    try {
      await updateAdminReportMemo(id, memo);
      toast.success('管理者メモが保存されました');
      
      // データを再読み込み
      loadReports();
    } catch (error) {
      console.error('Error saving memo:', error);
      toast.error('メモの保存に失敗しました');
    }
  };

  // 報告を処理する
  const handleReportAction = async (id: string, action: string, resolution?: string) => {
    setLoading(true);
    
    try {
      let status;
      switch (action) {
        case 'investigate':
          status = 'investigating';
          break;
        case 'resolve':
          status = 'resolved';
          break;
        case 'reopen':
          status = 'pending';
          break;
        default:
          throw new Error('Invalid action');
      }
      
      await updateAdminReport(id, { 
        status, 
        resolution: resolution || undefined 
      });
      
      toast.success(`報告が${
        action === 'investigate' ? '調査中' : 
        action === 'resolve' ? '解決済み' : 
        '再開'
      }に変更されました`);
      
      // 報告リストを再読み込み
      loadReports();
    } catch (err) {
      console.error('報告の更新に失敗しました:', err);
      toast.error('報告の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  // 報告を削除する
  const handleDeleteReport = async (id: string) => {
    if (!confirm('この報告を削除してもよろしいですか？この操作は元に戻せません。')) {
      return;
    }
    
    setLoading(true);
    
    try {
      await deleteAdminReport(id);
      toast.success('報告が削除されました');
      
      // 報告リストを再読み込み
      loadReports();
    } catch (err) {
      console.error('報告の削除に失敗しました:', err);
      toast.error('報告の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 詳細モーダルを開く
  const openDetailModal = (report: AdminReportWithUsers) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // 詳細モーダルを閉じる
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">報告・違反管理</h1>
          
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border rounded-md text-gray-700 text-sm"
              defaultValue="newest"
            >
              <option value="newest">最新順</option>
              <option value="oldest">古い順</option>
              <option value="severity">重大度順</option>
            </select>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
              レポート作成
            </button>
          </div>
        </div>
        
        {/* 検索とフィルター */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">キーワード検索</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ユーザー名や報告内容を検索..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div className="flex space-x-2 mb-4">
              {[
                { value: '', label: '全て' },
                { value: 'pending', label: '保留中' }, 
                { value: 'investigating', label: '調査中' }, 
                { value: 'resolved', label: '解決済' }
              ].map((statusOption) => (
                <button
                  key={statusOption.value}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filters.status === statusOption.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilters({ ...filters, status: statusOption.value })}
                >
                  {statusOption.label}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 mb-4">
              {[
                { value: '', label: '全ての重要度' },
                { value: 'low', label: '低' }, 
                { value: 'medium', label: '中' }, 
                { value: 'high', label: '高' },
                { value: 'critical', label: '最重要' }
              ].map((severityOption) => (
                <button
                  key={severityOption.value}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filters.severity === severityOption.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilters({ ...filters, severity: severityOption.value })}
                >
                  {severityOption.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
                onClick={() => {
                  setFilters({
                    status: '',
                    severity: '',
                    search: '',
                  });
                }}
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        </div>
        
        {/* タブ */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-4 py-3 font-medium ${filters.status === '' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setFilters({ ...filters, status: '' })}
              >
                全て
              </button>
              <button
                className={`px-4 py-3 font-medium ${filters.status === 'pending' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setFilters({ ...filters, status: 'pending' })}
              >
                保留中
              </button>
              <button
                className={`px-4 py-3 font-medium ${filters.status === 'investigating' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setFilters({ ...filters, status: 'investigating' })}
              >
                調査中
              </button>
              <button
                className={`px-4 py-3 font-medium ${filters.status === 'resolved' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setFilters({ ...filters, status: 'resolved' })}
              >
                解決済み
              </button>
            </div>
          </div>
          
          {/* 報告リスト */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          報告者
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          報告対象
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          種類
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          ステータス
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          重要度
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          日時
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">操作</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {reports.map((report) => (
                        <tr key={report.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={report.reporter?.image || `https://ui-avatars.com/api/?name=${report.reporter?.name || 'User'}&background=random`}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {report.reporter?.name || '不明なユーザー'}
                                </div>
                                <div className="text-gray-500">ID: {report.reporterId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={report.reported?.image || `https://ui-avatars.com/api/?name=${report.reported?.name || 'User'}&background=random`}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {report.reported?.name || '不明なユーザー'}
                                </div>
                                <div className="text-gray-500">ID: {report.reportedId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {report.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {report.status}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {report.severity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {report.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => openDetailModal(report)}
                                className="text-blue-600 hover:text-blue-900 font-semibold"
                              >
                                詳細
                              </button>
                              {report.status !== 'investigating' && (
                                <button
                                  onClick={() => handleReportAction(report.id.toString(), 'investigate')}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  調査
                                </button>
                              )}
                              {report.status !== 'resolved' && (
                                <button
                                  onClick={() => handleReportAction(report.id.toString(), 'resolve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  解決
                                </button>
                              )}
                              {report.status === 'resolved' && (
                                <button
                                  onClick={() => handleReportAction(report.id.toString(), 'reopen')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  再開
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReport(report.id.toString())}
                                className="text-red-600 hover:text-red-900"
                              >
                                削除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ページネーション */}
        {pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                disabled={pagination.page === pagination.pages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span>{pagination.total} 件中 </span>
                  <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1} </span>
                  <span>から </span>
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>
                  <span> 件を表示</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">前へ</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination({ ...pagination, page: pageNum })}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNum === pagination.page
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">次へ</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* 詳細モーダル */}
      {selectedReport && (
        <ReportDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          report={selectedReport}
          onStatusChange={handleStatusChange}
          onSaveMemo={handleSaveMemo}
        />
      )}
    </div>
  );
}

export default withAdminAuth(ReportsPage);