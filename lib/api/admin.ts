// lib/api/admin.ts
// 管理画面API関数

import { Message, User, Report } from '@prisma/client';

// 管理者API基本URL
const BASE_API_URL = '/api/admin';

export type AdminMessageWithUsers = Message & {
  sender: User | null;
  receiver: User | null;
  isFlagged?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  adminMemo?: string;
};

export type AdminReportWithUsers = Report & {
  reporter: User;
  reported: User;
  adminMemo?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

/**
 * 管理者用メッセージ一覧を取得する
 */
export async function fetchAdminMessages(
  params: {
    page?: number;
    limit?: number;
    userId?: string;
    matchId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filterType?: 'all' | 'flagged' | 'blocked';
  } = {}
): Promise<PaginatedResponse<AdminMessageWithUsers>> {
  // デフォルト値の設定
  const {
    page = 1,
    limit = 10,
    userId,
    matchId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filterType
  } = params;

  // クエリパラメータの構築
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  if (userId) queryParams.append('userId', userId);
  if (matchId) queryParams.append('matchId', matchId);
  if (search) queryParams.append('search', search);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  if (filterType) queryParams.append('filterType', filterType);

  // APIリクエスト
  try {
    const response = await fetch(`${BASE_API_URL}/messages?${queryParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('APIエラーレスポンス:', errorData);
      throw new Error(errorData.error || 'メッセージの取得に失敗しました');
    }
    
    const data = await response.json();
    console.log('正常なAPIレスポンス:', data);
    
    // レスポンスがnullやundefinedでないことを確認
    if (!data || !data.messages) {
      console.error('不正なAPIレスポンス形式:', data);
      throw new Error('APIレスポンスの形式が不正です');
    }
    
    // レスポンスのフォーマット変換
    return {
      data: data.messages || [],
      pagination: data.pagination || { 
        total: 0, 
        page: params.page || 1, 
        limit: params.limit || 10, 
        pages: 0 
      }
    };
  } catch (error) {
    console.error('fetchAdminMessages エラー:', error);
    throw error;
  }
}

/**
 * 特定のメッセージを更新する
 */
export async function updateAdminMessage(
  id: string,
  updates: {
    content?: string;
    read?: boolean;
    isFlagged?: boolean;
    isBlocked?: boolean;
    blockReason?: string;
    adminMemo?: string;
  }
): Promise<AdminMessageWithUsers> {
  const response = await fetch(`${BASE_API_URL}/messages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'メッセージの更新に失敗しました');
  }
  
  return response.json();
}

/**
 * 特定のメッセージを削除する
 */
export async function deleteAdminMessage(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${BASE_API_URL}/messages/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'メッセージの削除に失敗しました');
  }
  
  return response.json();
}

/**
 * 管理者用ユーザー情報を取得する
 */
export async function fetchAdminUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
): Promise<PaginatedResponse<User>> {
  const { page = 1, limit = 10, search = '' } = params;
  const url = new URL(`${BASE_API_URL}/users`, window.location.origin);
  
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (search) url.searchParams.append('search', search);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * 管理者用違反報告一覧を取得する
 */
export async function fetchAdminReports(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    search?: string;
  } = {}
): Promise<PaginatedResponse<AdminReportWithUsers>> {
  const { page = 1, limit = 10, status, severity, search } = params;
  const url = new URL(`${BASE_API_URL}/reports`, window.location.origin);
  
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (status) url.searchParams.append('status', status);
  if (severity) url.searchParams.append('severity', severity);
  if (search) url.searchParams.append('search', search);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

/**
 * 特定の違反報告を更新する
 */
export async function updateAdminReport(
  id: string,
  updates: {
    status?: string;
    severity?: string;
    resolution?: string;
    adminMemo?: string;
  }
): Promise<AdminReportWithUsers> {
  try {
    const response = await fetch(`${BASE_API_URL}/reports`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update report: ${response.statusText}. ${
          errorData.message || ''
        }`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

/**
 * 特定の違反報告を削除する
 */
export async function deleteAdminReport(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${BASE_API_URL}/reports`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete report: ${response.statusText}. ${
          errorData.message || ''
        }`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

/**
 * メッセージの管理メモを更新する
 */
export async function updateAdminMessageMemo(
  id: string,
  memo: string
): Promise<AdminMessageWithUsers> {
  return updateAdminMessage(id, { adminMemo: memo });
}

/**
 * 報告の管理メモを更新する
 */
export async function updateAdminReportMemo(
  id: string,
  memo: string
): Promise<AdminReportWithUsers> {
  return updateAdminReport(id, { adminMemo: memo });
}
