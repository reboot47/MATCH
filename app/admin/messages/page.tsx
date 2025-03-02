"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchAdminMessages, updateAdminMessage, deleteAdminMessage, updateAdminMessageMemo } from '@/lib/api/admin';
import styles from './messages.module.css';
import { withAdminAuth } from '@/lib/auth/requireAdmin';
import MessageDetailModal from '@/components/admin/MessageDetailModal';

// インターフェース定義
interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  receiverId: string;
  matchId: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  isFlagged: boolean;
  isBlocked: boolean;
  blockReason: string;
  memo?: string;
}

interface ApiResponse {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const MessagesMonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  // メッセージデータの取得
  const fetchMessageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // activeTabに基づいてフィルタータイプを設定
      const filterType = activeTab === 'all' ? 'all' : 
                         activeTab === 'flagged' ? 'flagged' : 
                         activeTab === 'blocked' ? 'blocked' : 'all';
                         
      console.log('🔍 メッセージデータを取得中...');
      console.log('パラメータ:', {
        page: currentPage,
        limit,
        search: searchTerm,
        sortBy,
        sortOrder,
        filterType
      });
      
      const response = await fetchAdminMessages({
        page: currentPage,
        limit,
        search: searchTerm,
        sortBy,
        sortOrder,
        filterType: filterType as 'all' | 'flagged' | 'blocked'
      });
      
      console.log('📊 取得したメッセージ:', response);
      
      if (!response || !response.data) {
        console.error('無効なレスポンス形式:', response);
        throw new Error('APIからの応答が無効な形式です');
      }
      
      setMessages(response.data);
      setTotalMessages(response.pagination?.total || 0);
    } catch (err: any) {
      console.error('メッセージの取得に失敗しました:', err);
      setError(`メッセージデータの取得に失敗しました: ${err.message || 'Unknown error'}`);
      setMessages([]);
      setTotalMessages(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPage, limit, sortBy, sortOrder, activeTab]);
  
  // 初回ロード時およびフィルター変更時にデータを取得
  useEffect(() => {
    fetchMessageData();
  }, [fetchMessageData]);
  
  // タブ変更時のハンドラー
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // タブ変更時はページを1に戻す
    
    // タブに応じてフィルターを設定
    const filterType = tab === 'all' ? 'all' : 
                       tab === 'flagged' ? 'flagged' : 
                       tab === 'blocked' ? 'blocked' : 'all';
                       
    // 新しいフィルターでデータを取得
    fetchMessageData();
  };
  
  // 検索入力時のハンドラー
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 検索実行
  const handleSearchSubmit = () => {
    setCurrentPage(1); // 検索時はページを1に戻す
    fetchMessageData();
  };
  
  // ページ変更時のハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // ソート順変更時のハンドラー
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'latest') {
      setSortBy('createdAt');
      setSortOrder('desc');
    } else if (value === 'oldest') {
      setSortBy('createdAt');
      setSortOrder('asc');
    }
  };
  
  // メッセージの詳細モーダルを表示
  const openMessageDetail = (message: Message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
  };
  
  // モーダルを閉じる
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMessage(null);
    setActionFeedback(null);
  };
  
  // アクション実行
  const handleMessageAction = async (messageId: string, action: string) => {
    setIsActionProcessing(true);
    setActionFeedback(null);
    
    try {
      // 実際のAPIに接続
      switch (action) {
        case 'flag':
          await updateAdminMessage(messageId, {
            isFlagged: true
          });
          setActionFeedback({
            type: 'success',
            message: 'メッセージにフラグを付けました'
          });
          break;
          
        case 'unflag':
          await updateAdminMessage(messageId, {
            isFlagged: false
          });
          setActionFeedback({
            type: 'success',
            message: 'メッセージのフラグを解除しました'
          });
          break;
          
        case 'block':
          await updateAdminMessage(messageId, {
            isBlocked: true
          });
          setActionFeedback({
            type: 'success',
            message: 'メッセージをブロックしました'
          });
          break;
          
        case 'unblock':
          await updateAdminMessage(messageId, {
            isBlocked: false
          });
          setActionFeedback({
            type: 'success',
            message: 'メッセージのブロックを解除しました'
          });
          break;
      }
      
      // 成功したらデータを再取得
      await fetchMessageData();
      
    } catch (err) {
      console.error('アクション実行エラー:', err);
      setActionFeedback({
        type: 'error',
        message: 'アクションの実行に失敗しました'
      });
    } finally {
      setIsActionProcessing(false);
    }
  };

  // メッセージ削除ハンドラー
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('このメッセージを削除しますか？この操作は元に戻せません。')) {
      return;
    }
    
    try {
      await deleteAdminMessage(messageId);
      await fetchMessageData();
      
      // モーダルが開いていて、削除したメッセージが表示されている場合は閉じる
      if (selectedMessage && selectedMessage.id === messageId) {
        closeDetailModal();
      }
      
      // 成功メッセージ
      setActionFeedback({
        type: 'success',
        message: 'メッセージを削除しました'
      });
      
    } catch (err) {
      console.error('メッセージ削除エラー:', err);
      setActionFeedback({
        type: 'error',
        message: '削除に失敗しました'
      });
    }
  };

  // メモ保存処理
  const handleSaveMemo = async (id: string, memo: string) => {
    try {
      await updateAdminMessageMemo(id, memo);
      setActionFeedback({
        type: 'success',
        message: '管理者メモが保存されました'
      });
      
      // データを再読み込み
      await fetchMessageData();
    } catch (err) {
      console.error('メモ保存エラー:', err);
      setActionFeedback({
        type: 'error',
        message: 'メモの保存に失敗しました'
      });
    }
  };

  // ページネーションコンポーネント
  const Pagination = () => {
    const totalPages = Math.ceil(totalMessages / limit);
    
    return (
      <div className={styles['pagination-container']}>
        <button 
          className={styles['pagination-button']} 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          前へ
        </button>
        
        <span className={styles['pagination-info']}>
          {currentPage} / {totalPages > 0 ? totalPages : 1} ページ （全{totalMessages}件）
        </span>
        
        <button 
          className={styles['pagination-button']} 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          次へ
        </button>
      </div>
    );
  };
  
  return (
    <div className={styles['admin-page']}>
      <h1 className={styles['page-title']}>メッセージ監視</h1>
      
      <div className={styles['filter-bar']}>
        <div className={styles['tab-container']}>
          <button 
            className={`${styles['tab-button']} ${activeTab === 'all' ? styles['active'] : ''}`}
            onClick={() => handleTabChange('all')}
          >
            すべて
          </button>
          <button 
            className={`${styles['tab-button']} ${activeTab === 'flagged' ? styles['active'] : ''}`}
            onClick={() => handleTabChange('flagged')}
          >
            フラグ付き
          </button>
          <button 
            className={`${styles['tab-button']} ${activeTab === 'blocked' ? styles['active'] : ''}`}
            onClick={() => handleTabChange('blocked')}
          >
            ブロック
          </button>
        </div>
        
        <div className={styles['search-container']}>
          <input 
            type="text" 
            placeholder="メッセージを検索..." 
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className={styles['search-input']}
          />
          <button 
            className={styles['search-button']}
            onClick={handleSearchSubmit}
          >
            検索
          </button>
        </div>
        
        <div className={styles['sort-container']}>
          <label htmlFor="sort-select">並び順:</label>
          <select 
            id="sort-select"
            value={sortBy === 'createdAt' ? (sortOrder === 'desc' ? 'latest' : 'oldest') : ''}
            onChange={handleSortChange}
            className={styles['sort-select']}
          >
            <option value="latest">新しい順</option>
            <option value="oldest">古い順</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className={styles['error-message']}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}></div>
          <p>メッセージを読み込み中...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>メッセージが見つかりませんでした</p>
        </div>
      ) : (
        <>
          <table className={styles['messages-table']}>
            <thead>
              <tr>
                <th>日時</th>
                <th>送信者</th>
                <th>受信者</th>
                <th>内容</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} onClick={() => openMessageDetail(message)}>
                  <td>{new Date(message.createdAt).toLocaleString()}</td>
                  <td>{message.sender?.name || '不明なユーザー'}</td>
                  <td>{message.receiver?.name || '不明なユーザー'}</td>
                  <td className={styles['message-content']}>{message.content}</td>
                  <td>
                    <div className={styles['status-badges']}>
                      {message.read ? (
                        <span className={styles['badge'] + ' ' + styles['read-badge']}>既読</span>
                      ) : (
                        <span className={styles['badge'] + ' ' + styles['unread-badge']}>未読</span>
                      )}
                      
                      {message.isFlagged && (
                        <span className={styles['badge'] + ' ' + styles['flagged-badge']}>フラグ</span>
                      )}
                      {message.isBlocked && (
                        <span className={styles['badge'] + ' ' + styles['blocked-badge']}>ブロック</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles['action-buttons']}>
                      <button 
                        className={styles['action-button'] + ' ' + styles['view-button']}
                        onClick={(e) => {
                          e.stopPropagation();
                          openMessageDetail(message);
                        }}
                      >
                        詳細
                      </button>
                      <button 
                        className={styles['action-button'] + ' ' + styles['delete-button']}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination />
        </>
      )}
      
      {/* 詳細モーダル */}
      <MessageDetailModal
        message={selectedMessage}
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        onStatusChange={handleMessageAction}
        onSaveMemo={handleSaveMemo}
      />
    </div>
  );
};

export default withAdminAuth(MessagesMonitoringPage);
