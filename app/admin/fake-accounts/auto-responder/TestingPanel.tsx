"use client";

import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Textarea } from '../../../../components/ui/textarea';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../../components/ui/card';
import { ResponseTemplate, ResponseRule } from './types';
import { evaluateRules, replaceTemplateVariables } from './utils';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface TestingPanelProps {
  templates: ResponseTemplate[];
  rules: ResponseRule[];
}

export default function TestingPanel({ templates, rules }: TestingPanelProps) {
  // テスト入力
  const [inputMessage, setInputMessage] = useState('');
  const [userData, setUserData] = useState({
    userName: 'サンプルユーザー',
    age: '25',
    gender: '男性',
    location: '東京',
    interests: '音楽、映画',
    messageCount: '3',
    lastActiveTime: '2時間前'
  });
  
  // テスト結果
  const [matchedRule, setMatchedRule] = useState<ResponseRule | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // マニュアルテスト用に選択されたテンプレート
  const [manualTemplateId, setManualTemplateId] = useState('');
  
  // テスト実行
  const runTest = () => {
    setIsLoading(true);
    try {
      // 実際のAPI呼び出しの代わりにフロントエンドでルール評価
      const context = {
        message: inputMessage,
        user: userData
      };
      
      // 有効なルールのみをフィルタリング
      const activeRules = rules.filter(rule => rule.isActive);
      
      // ルール評価
      const matchedRuleResult = evaluateRules(activeRules, context);
      setMatchedRule(matchedRuleResult);
      
      // マッチしたルールに関連するテンプレートを取得
      if (matchedRuleResult && matchedRuleResult.templateId) {
        const template = templates.find(t => t.id === matchedRuleResult.templateId);
        if (template) {
          setSelectedTemplate(template);
          
          // テンプレート変数を置換
          const context = {
            message: inputMessage,
            user: userData
          };
          
          const processedMessage = replaceTemplateVariables(template.message, context);
          setResponseMessage(processedMessage);
        } else {
          setSelectedTemplate(null);
          setResponseMessage('選択されたテンプレートが見つかりません');
        }
      } else {
        setSelectedTemplate(null);
        setResponseMessage('マッチするルールがありません');
      }
    } catch (error) {
      console.error('テスト実行エラー:', error);
      toast.error('テスト実行中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  // マニュアルテスト（特定のテンプレートをテスト）
  const runManualTest = () => {
    setIsLoading(true);
    try {
      if (!manualTemplateId) {
        toast.error('テンプレートを選択してください');
        return;
      }
      
      const template = templates.find(t => t.id === manualTemplateId);
      if (!template) {
        toast.error('選択されたテンプレートが見つかりません');
        return;
      }
      
      setSelectedTemplate(template);
      setMatchedRule(null);
      
      // テンプレート変数を置換
      const context = {
        message: inputMessage,
        user: userData
      };
      
      const processedMessage = replaceTemplateVariables(template.message, context);
      setResponseMessage(processedMessage);
    } catch (error) {
      console.error('マニュアルテスト実行エラー:', error);
      toast.error('テスト実行中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>テスト入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="inputMessage">受信メッセージ</Label>
              <Textarea
                id="inputMessage"
                placeholder="テストするメッセージを入力..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">ユーザー名</Label>
                <Input
                  id="userName"
                  value={userData.userName}
                  onChange={(e) => setUserData({...userData, userName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">年齢</Label>
                <Input
                  id="age"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gender">性別</Label>
                <Input
                  id="gender"
                  value={userData.gender}
                  onChange={(e) => setUserData({...userData, gender: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="location">場所</Label>
                <Input
                  id="location"
                  value={userData.location}
                  onChange={(e) => setUserData({...userData, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="interests">興味</Label>
                <Input
                  id="interests"
                  value={userData.interests}
                  onChange={(e) => setUserData({...userData, interests: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="messageCount">メッセージ数</Label>
                <Input
                  id="messageCount"
                  value={userData.messageCount}
                  onChange={(e) => setUserData({...userData, messageCount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastActiveTime">最終アクティブ</Label>
                <Input
                  id="lastActiveTime"
                  value={userData.lastActiveTime}
                  onChange={(e) => setUserData({...userData, lastActiveTime: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setInputMessage('');
                setUserData({
                  userName: 'サンプルユーザー',
                  age: '25',
                  gender: '男性',
                  location: '東京',
                  interests: '音楽、映画',
                  messageCount: '3',
                  lastActiveTime: '2時間前'
                });
              }}
            >
              リセット
            </Button>
            <Button onClick={runTest} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></span>
                  テスト中...
                </span>
              ) : (
                '自動応答をテスト'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>テスト結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[150px] p-4 border rounded-md bg-gray-50">
              {responseMessage ? (
                <div>
                  <div className="flex items-center mb-2">
                    {matchedRule ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      matchedRule === null && selectedTemplate ? (
                        <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                      )
                    )}
                    <span className="font-medium">
                      {matchedRule
                        ? `ルール "${matchedRule.name}" がマッチしました`
                        : matchedRule === null && selectedTemplate
                        ? 'マニュアルテンプレート選択'
                        : 'マッチするルールがありません'}
                    </span>
                  </div>
                  
                  {selectedTemplate && (
                    <div className="mb-2 text-sm text-gray-600">
                      選択テンプレート: {selectedTemplate.title} ({selectedTemplate.category})
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-white border rounded-md">
                    {responseMessage}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span>テスト結果がここに表示されます</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="manualTemplate">特定のテンプレートをテスト</Label>
              <div className="flex space-x-2 mt-1">
                <Select value={manualTemplateId} onValueChange={setManualTemplateId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="テンプレートを選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter(t => t.isActive)
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={runManualTest} disabled={isLoading || !manualTemplateId}>
                  テスト
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
