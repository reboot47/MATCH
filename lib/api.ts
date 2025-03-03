/**
 * API関連の共通関数を定義するファイル
 */

// 基本的なAPIエンドポイントのベースURL
const API_BASE_URL = '/api';

/**
 * GETリクエストを実行する共通関数
 * @param endpoint APIエンドポイント
 * @param params クエリパラメータ
 * @returns レスポンスデータ
 */
export async function fetchAPI<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  // クエリパラメータの構築
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${API_BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * POSTリクエストを実行する共通関数
 * @param endpoint APIエンドポイント
 * @param data 送信データ
 * @returns レスポンスデータ
 */
export async function postAPI<T>(endpoint: string, data: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * PUTリクエストを実行する共通関数
 * @param endpoint APIエンドポイント
 * @param data 更新データ
 * @returns レスポンスデータ
 */
export async function putAPI<T>(endpoint: string, data: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * DELETEリクエストを実行する共通関数
 * @param endpoint APIエンドポイント
 * @param params クエリパラメータ
 * @returns レスポンスデータ
 */
export async function deleteAPI<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  // クエリパラメータの構築
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${API_BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * 管理者API - ユーザー取得
 */
export async function fetchUsers(params: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return fetchAPI('/admin/users', params);
}

/**
 * 管理者API - メッセージ取得
 */
export async function fetchMessages(params: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return fetchAPI('/admin/messages', params);
}

/**
 * 管理者API - メッセージ更新（フラグ/ブロック）
 */
export async function updateMessage(data: {
  id: string;
  action: 'flag' | 'unflag' | 'block' | 'unblock';
  reason?: string;
}) {
  return putAPI('/admin/messages', data);
}

/**
 * 管理者API - 報告取得
 */
export async function fetchReports(params: {
  search?: string;
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}) {
  return fetchAPI('/admin/reports', params);
}

/**
 * 管理者API - 報告更新
 */
export async function updateReport(data: {
  id: number;
  action: 'investigate' | 'resolve' | 'reopen';
  resolution?: 'warning' | 'banned' | 'dismissed' | 'monitoring';
  notes?: string;
}) {
  return putAPI('/admin/reports', data);
}
