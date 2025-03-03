"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table';
import { toast } from 'react-hot-toast';
import { DateRangePicker } from '../../../../components/ui/date-range-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';

// ログエントリの型
interface LogEntry {
  id: string;
  timestamp: string;
  fakeAccountId: string;
  fakeAccountName: string;
  userId: string;
  userName: string;
  messageContent: string;
  appliedRuleId: string;
  appliedRuleName: string;
  templateId: string;
  templateName: string;
  responseContent: string;
}

export default function ResponseLogger() {
  // 状態管理
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // ログデータ取得
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // 実際の環境では、以下のようなAPIエンドポイントを呼び出します
      /*
      const response = await fetch('/api/admin/auto-responder/logs?' + new URLSearchParams({
        page: page.toString(),
        search: searchQuery,
        fromDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
        toDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
      }));
      
      if (!response.ok) throw new Error('ログの取得に失敗しました');
      
      const data = await response.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      */
      
      // 開発用にモックデータを使用
      // 実際の実装では、この部分を上記のコメントアウトされたAPIコールに置き換えます
      setTimeout(() => {
        const mockLogs: LogEntry[] = Array.from({ length: 10 }).map((_, i) => ({
          id: `log-${i + (page - 1) * 10}`,
          timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          fakeAccountId: `fake-${i}`,
          fakeAccountName: `サクラアカウント ${i + 1}`,
          userId: `user-${i}`,
          userName: `ユーザー ${i + 1}`,
          messageContent: `こんにちは、${searchQuery ? searchQuery : '元気'}ですか？`,
          appliedRuleId: `rule-${i % 3}`,
          appliedRuleName: `挨拶応答ルール ${i % 3 + 1}`,
          templateId: `template-${i % 5}`,
          templateName: `標準挨拶テンプレート ${i % 5 + 1}`,
          responseContent: `はい、元気です！あなたはどうですか？${i + 1}`
        }));
        
        setLogs(mockLogs);
        setTotalPages(5);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('ログ取得エラー:', error);
      toast.error('ログの取得に失敗しました');
      setLoading(false);
    }
  };
  
  // 検索や日付変更時にデータを再取得
  useEffect(() => {
    fetchLogs();
  }, [page, searchQuery, dateRange]);
  
  // ページネーション制御
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  // 表示用に日時をフォーマット
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ja });
    } catch {
      return dateString;
    }
  };
  
  // 検索ハンドラー
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 検索時は1ページ目に戻る
    fetchLogs();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>自動応答ログ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">検索</Button>
            </form>
            <div className="w-full sm:w-auto">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                locale={ja}
                placeholder="日付範囲を選択"
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableCaption>自動応答ログ {logs.length > 0 ? `(${page}/${totalPages}ページ)` : ''}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>サクラアカウント</TableHead>
                  <TableHead>ユーザー</TableHead>
                  <TableHead>適用ルール</TableHead>
                  <TableHead>使用テンプレート</TableHead>
                  <TableHead>内容</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      ログデータが見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.fakeAccountName}>
                        {log.fakeAccountName}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.userName}>
                        {log.userName}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.appliedRuleName}>
                        {log.appliedRuleName}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.templateName}>
                        {log.templateName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.responseContent}>
                        {log.responseContent}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* ページネーション */}
          {logs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={goToPrevPage}
                disabled={page === 1 || loading}
              >
                前のページ
              </Button>
              <span className="text-sm text-gray-500">
                {page} / {totalPages} ページ
              </span>
              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={page === totalPages || loading}
              >
                次のページ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
