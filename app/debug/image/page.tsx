'use client';

import React from 'react';
import ImageDebugPanel from '@/app/components/dev/ImageDebugPanel';
import Link from 'next/link';

/**
 * 画像デバッグ情報を確認するための開発専用ページ
 * このページは開発環境でのみアクセス可能
 */
export default function ImageDebugPage() {
  // 本番環境ではアクセス不可
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">アクセス不可</h1>
        <p className="text-gray-700 mb-4">このページは開発環境でのみ利用可能です。</p>
        <Link href="/" className="text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">画像デバッグツール</h1>
        <p className="text-gray-600">LineBuzzアプリにおける画像ロードの成功・失敗を追跡します</p>
        <Link href="/" className="text-blue-600 hover:underline block mt-2">
          ← アプリに戻る
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">画像ロードモニター</h2>
          <div className="image-debug-container relative">
            <ImageDebugPanel />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">トラブルシューティング</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>画像パスエラー:</strong> 画像のパスが間違っている場合は、適切なパスに修正
            </li>
            <li>
              <strong>拡張子の不一致:</strong> ファイル拡張子（PNG/SVG/JPG）が正しいか確認
            </li>
            <li>
              <strong>CORS問題:</strong> 外部画像を使用している場合、プロキシAPIを経由しているか確認
            </li>
            <li>
              <strong>キャッシュの問題:</strong> ブラウザキャッシュをクリアするか、開発サーバーを再起動
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">テスト方法</h2>
        <code className="block bg-gray-100 p-3 rounded">
          npm run test:image-components
        </code>
        <p className="mt-2 text-sm text-gray-600">
          このコマンドはPuppeteerを使用して、アプリの主要なページで画像が正しく表示されるかをテストします。
        </p>
      </div>
    </div>
  );
}
