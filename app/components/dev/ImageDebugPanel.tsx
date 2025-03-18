'use client';

import React, { useState, useEffect } from 'react';

interface ImageStats {
  success: number;
  errors: number;
  errorRatio: string;
  details: Record<string, { count: number, lastError: string }>;
}

interface StatsResponse {
  timestamp: string;
  environment: string;
  stats: ImageStats;
}

/**
 * 画像ロード状況をモニタリングするための開発用パネル
 * 開発環境でのみ使用可能
 */
export default function ImageDebugPanel() {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 統計情報をロード
  const loadStats = async () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/debug/image-stats');
      if (response.ok) {
        const data = await response.json() as StatsResponse;
        setStats(data.stats);
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
      } else {
        console.error('画像統計の取得に失敗しました:', await response.text());
      }
    } catch (error) {
      console.error('画像統計の取得中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // 統計をリセット
  const resetStats = async () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/debug/image-stats', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json() as StatsResponse;
        setStats(data.stats);
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
      } else {
        console.error('画像統計のリセットに失敗しました:', await response.text());
      }
    } catch (error) {
      console.error('画像統計のリセット中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初回ロードと定期更新
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    // 初回ロード
    loadStats();
    
    // 10秒ごとに統計を更新
    const interval = setInterval(loadStats, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // 開発環境でなければ何も表示しない
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-lg p-3 z-50 text-xs border border-gray-300 dark:border-gray-700 max-w-md">
      <div className="flex justify-between items-center mb-1">
        <button 
          className="font-semibold text-blue-600 dark:text-blue-400 flex items-center"
          onClick={() => setExpanded(!expanded)}
        >
          📊 画像ロードモニター 
          <span className="ml-1">{expanded ? '▲' : '▼'}</span>
        </button>
        <div className="flex space-x-2">
          <button 
            onClick={loadStats} 
            disabled={loading}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            🔄
          </button>
          <button 
            onClick={resetStats}
            disabled={loading}
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-2 overflow-auto max-h-60">
          {stats ? (
            <>
              <div className="flex justify-between text-gray-700 dark:text-gray-300 text-xs mb-2">
                <span>最終更新: {lastUpdated}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <div className="font-bold text-green-700 dark:text-green-400">成功</div>
                  <div>{stats.success}</div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  <div className="font-bold text-red-700 dark:text-red-400">エラー</div>
                  <div>{stats.errors}</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                  <div className="font-bold text-blue-700 dark:text-blue-400">エラー率</div>
                  <div>{stats.errorRatio}</div>
                </div>
              </div>
              
              {Object.keys(stats.details).length > 0 && (
                <div>
                  <div className="font-semibold mb-1 text-gray-700 dark:text-gray-300">エラー詳細:</div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto max-h-40">
                    {Object.entries(stats.details).map(([key, detail]) => (
                      <div key={key} className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                        <div className="font-medium text-red-600 dark:text-red-400 break-all">{key}</div>
                        <div className="text-gray-700 dark:text-gray-300">回数: {detail.count}</div>
                        <div className="text-gray-700 dark:text-gray-300 break-all">
                          最終エラー: {detail.lastError}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-2 text-gray-500 dark:text-gray-400">
              {loading ? 'データを読み込み中...' : 'データがありません'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
