import React, { useEffect, useState } from 'react';
import { UrlPreviewData } from './UrlPreview';

/**
 * URLを検出するカスタムフック
 * メッセージの内容からURLを抽出し、それらのURLに対するプレビュー情報を取得する
 */
export function useUrlPreviews(content: string, isDeleted: boolean) {
  const [urlPreviews, setUrlPreviews] = useState<UrlPreviewData[]>([]);
  
  // 正規表現でURLを検出する
  const detectUrls = (text: string | undefined): string[] => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };
  
  // メッセージ内のURLを検出
  const urlsInContent = React.useMemo(() => {
    return !isDeleted ? detectUrls(content) : [];
  }, [isDeleted, content]);
  
  // 前回のURL文字列を保存するリファレンス
  const prevUrlsRef = React.useRef('');

  // URLプレビューを取得する
  useEffect(() => {
    // 早期リターン - URLがないか削除されたメッセージの場合は処理しない
    if (isDeleted || !urlsInContent || urlsInContent.length === 0) {
      setUrlPreviews([]);
      return;
    }
    
    // 既に同じURLのプレビューが処理中なら再度取得しない
    // これにより無限ループを防止する
    const currentUrls = urlsInContent.join(',');
    
    if (prevUrlsRef.current === currentUrls && urlPreviews.length > 0) {
      return;
    }
    
    prevUrlsRef.current = currentUrls;
    
    // 初期ローディング状態を設定
    const initialPreviews = urlsInContent.map(url => ({
      url,
      title: 'リンクを読み込み中...',
      description: '',
      isLoading: true
    }));
    setUrlPreviews(initialPreviews);
    
    // URLプレビュー情報を取得する非同期関数
    const fetchUrlPreviews = async () => {
      try {
        // 各URLを並行して処理するが、一つのエラーが全体を止めないように
        const previewPromises = urlsInContent.map(async (url) => {
          try {
            // ドメイン名を安全に取得
            const getDomain = (urlString: string): string => {
              try {
                const urlObj = new URL(urlString);
                return urlObj.hostname;
              } catch (e) {
                return urlString.replace(/^https?:\/\//, '').split('/')[0];
              }
            };
            
            const domain = getDomain(url);
            
            try {
              // タイムアウト付きのフェッチ
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              
              const response = await fetch(`/api/url-preview?url=${encodeURIComponent(url)}`, {
                signal: controller.signal
              });
              
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                throw new Error(`APIレスポンスエラー: ${response.status}`);
              }
              
              const data = await response.json();
              
              if (data.success && data.preview) {
                // APIから取得したデータでプレビューを生成
                return {
                  url,
                  title: data.preview.title || domain,
                  description: data.preview.description || '',
                  image: data.preview.image,
                  siteName: data.preview.siteName,
                  domain: data.preview.domain || domain,
                  isLoading: false
                };
              } else {
                // エラー時のフォールバック
                console.error('URLプレビュー取得失敗:', data.error);
                return {
                  url,
                  title: domain,
                  description: 'リンク情報を取得できませんでした',
                  domain,
                  isLoading: false,
                  error: data.error
                };
              }
            } catch (fetchError) {
              // ネットワークエラーやタイムアウト時の処理
              const isAbortError = fetchError instanceof DOMException && fetchError.name === 'AbortError';
              const errorMsg = isAbortError ? '接続がタイムアウトしました' : 'サーバーに接続できませんでした';
              
              console.error(`URLプレビュー取得エラー (${url}):`, fetchError);
              return {
                url,
                title: domain,
                description: errorMsg, 
                domain,
                isLoading: false,
                error: String(fetchError)
              };
            }
          } catch (urlError) {
            // URLのパース自体に失敗した場合
            console.error(`無効なURL: ${url}`, urlError);
            const fallbackDomain = typeof url === 'string' ? 
              url.replace(/^https?:\/\//, '').split('/')[0] || 'リンク' : 'リンク';
            
            return {
              url,
              title: fallbackDomain,
              description: '無効なURLフォーマットです',
              domain: fallbackDomain,
              isLoading: false,
              error: String(urlError)
            };
          }
        });
        
        // すべてのプレビュー結果を収集
        const previews = await Promise.all(previewPromises);
        setUrlPreviews(previews);
      } catch (error) {
        console.error('URLプレビュー処理エラー:', error);
        // 致命的なエラー時も基本的な情報を表示
        const basicPreviews = urlsInContent.map(url => ({
          url,
          title: url,
          description: 'プレビューを表示できません',
          isLoading: false,
          error: String(error)
        }));
        setUrlPreviews(basicPreviews);
      }
    };
    
    // APIリクエストを実行
    fetchUrlPreviews();
  }, [isDeleted, urlsInContent]);

  return { urlPreviews };
}
