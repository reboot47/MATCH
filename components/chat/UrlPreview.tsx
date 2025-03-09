import React from 'react';
import Image from 'next/image';
import { Link } from 'lucide-react';

export interface UrlPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  siteName?: string;
  isLoading?: boolean;
  error?: string;
}

interface UrlPreviewProps {
  preview: UrlPreviewData;
  isMe: boolean;
}

/**
 * LINE風のURLプレビューコンポーネント
 * チャットメッセージ内のURLを表示するためのプレビュー
 */
const UrlPreview: React.FC<UrlPreviewProps> = ({ preview, isMe }) => {
  // ドメイン名を安全に取得する関数
  const safeGetDomain = (url: string): string => {
    try {
      const domainFromUrl = new URL(url).hostname;
      return preview.domain || domainFromUrl;
    } catch (e) {
      // URLが無効な場合、URLからホスト名部分を抽出する簡易的な方法
      return preview.domain || url.replace(/^https?:\/\//, '').split('/')[0];
    }
  };

  // エラーがある場合はシンプルなリンク表示
  if (preview.error) {
    return (
      <a
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-${isMe ? 'white' : 'blue-500'} underline text-xs break-all`}
      >
        {preview.url}
      </a>
    );
  }

  // ローディング中の表示
  if (preview.isLoading) {
    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="inline-block mr-1">⏳</span>
        リンク情報を読み込み中...
      </div>
    );
  }

  // プレビュー表示
  return (
    <a 
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md border border-gray-200 overflow-hidden my-1 max-w-xs hover:bg-gray-50 transition-colors"
    >
      {preview.image && (
        <div className="w-full h-32 bg-gray-100 relative overflow-hidden">
          <Image 
            src={preview.image} 
            alt={preview.title || 'リンクプレビュー'}
            width={320}
            height={180}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-2 bg-white">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 mr-1 flex-shrink-0 flex items-center justify-center">
            <Link size={12} className="text-gray-400" />
          </div>
          <span className="text-xs text-gray-500 truncate">
            {safeGetDomain(preview.url)}
          </span>
        </div>
        {preview.title && (
          <h4 className="font-medium text-sm text-gray-800 line-clamp-2">
            {preview.title}
          </h4>
        )}
        {preview.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {preview.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default UrlPreview;
