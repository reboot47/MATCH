// imageDebugger.ts - 画像コンポーネントのデバッグとモニタリングのためのユーティリティ

/**
 * 画像コンポーネントのデバッグ情報を集約して記録するためのユーティリティ
 * これは特に本番環境では無効化されるデバッグ専用のツールです
 */

// デバッグが有効かどうかを環境変数で制御
const isDebugEnabled = process.env.NODE_ENV === 'development';

// エラーカウンターとログ
let imageErrorCount = 0;
let successCount = 0;
const errorLog: Record<string, { count: number, lastError: string }> = {};

/**
 * 画像のロードエラーを記録
 */
export function logImageError(component: string, src: string, error: Error | string): void {
  if (!isDebugEnabled) return;
  
  imageErrorCount++;
  const errorKey = `${component}:${src}`;
  const errorMessage = error instanceof Error ? error.message : error;
  
  if (!errorLog[errorKey]) {
    errorLog[errorKey] = { count: 0, lastError: '' };
  }
  
  errorLog[errorKey].count++;
  errorLog[errorKey].lastError = errorMessage;
  
  console.error(`[画像エラー] ${component} (${src}): ${errorMessage}`);
}

/**
 * 画像のロード成功を記録
 */
export function logImageSuccess(component: string, src: string): void {
  if (!isDebugEnabled) return;
  successCount++;
  console.log(`[画像成功] ${component} (${src})`);
}

/**
 * エラー統計を取得
 */
export function getImageStats(): { success: number, errors: number, errorRatio: string, details: typeof errorLog } {
  const total = successCount + imageErrorCount;
  const errorRatio = total > 0 ? `${(imageErrorCount / total * 100).toFixed(2)}%` : '0%';
  
  return {
    success: successCount,
    errors: imageErrorCount,
    errorRatio,
    details: errorLog
  };
}

/**
 * すべての記録をクリア
 */
export function resetImageStats(): void {
  imageErrorCount = 0;
  successCount = 0;
  Object.keys(errorLog).forEach(key => delete errorLog[key]);
}

// 開発者向けのグローバルアクセス（開発環境のみ）
if (isDebugEnabled && typeof window !== 'undefined') {
  (window as any).__imageDebugger = {
    getStats: getImageStats,
    reset: resetImageStats
  };
}
