"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { withAdminAuth } from '../../../../components/auth/withAdminAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { ResponseTemplate, ResponseRule } from './types';
import TemplateEditModal from './TemplateEditModal';
import RuleEditModal from './RuleEditModal';
import TestingPanel from './TestingPanel';
import ResponseLogger from './ResponseLogger';
import VariableSelector from './VariableSelector';
import autoResponderService from '../../../../services/autoResponderService';
import { MOCK_TEMPLATES, MOCK_RULES } from './mockData';
import { TEMPLATE_CATEGORIES } from './constants';

// タブ値の型
type TabValue = 'templates' | 'rules' | 'testing' | 'logs';

// モーダル状態の型
type ModalState = {
  templateModal: boolean;
  ruleModal: boolean;
};

function AutoResponderPage() {
  // タブ状態
  const [activeTab, setActiveTab] = useState<TabValue>('templates');
  
  // テンプレートとルールの状態
  const [templates, setTemplates] = useState<ResponseTemplate[]>(MOCK_TEMPLATES);
  const [rules, setRules] = useState<ResponseRule[]>(MOCK_RULES);
  
  // データ読み込み状態
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 検索状態
  const [searchQuery, setSearchQuery] = useState('');
  
  // モーダル状態
  const [modalOpen, setModalOpen] = useState<ModalState>({
    templateModal: false,
    ruleModal: false,
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [selectedRule, setSelectedRule] = useState<ResponseRule | null>(null);
  
  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // デバッグ目的で常にモックデータを使用
        console.log('モックデータを使用します:', MOCK_TEMPLATES);
        console.log('モックデータの型:', typeof MOCK_TEMPLATES, Array.isArray(MOCK_TEMPLATES));
        
        if (Array.isArray(MOCK_TEMPLATES)) {
          console.log('テンプレート数:', MOCK_TEMPLATES.length);
          MOCK_TEMPLATES.forEach((template, index) => {
            console.log(`テンプレート ${index}:`, template);
            console.log(`テンプレート ${index} プロパティ:`, Object.keys(template));
          });
        }
        
        setTemplates(MOCK_TEMPLATES);
        setRules(MOCK_RULES);
        setError(null);
        
        // APIからのデータ取得はコメントアウト
        /*
        // テンプレート取得
        console.log('テンプレート取得を試みます...');
        const templatesData = await autoResponderService.templates.getAll();
        console.log('取得したテンプレートデータ:', templatesData);
        setTemplates(templatesData);
        
        // ルール取得
        console.log('ルール取得を試みます...');
        const rulesData = await autoResponderService.rules.getAll();
        console.log('取得したルールデータ:', rulesData);
        setRules(rulesData);
        */
      } catch (err) {
        console.error('データ取得エラー:', err);
        if (err instanceof Error) {
          console.error('エラーメッセージ:', err.message);
          console.error('エラータイプ:', err.name);
          setError(`データの取得に失敗しました: ${err.message}`);
        } else {
          setError('データの取得に失敗しました。');
        }
        
        // 開発のためにモックデータを使用
        console.log('モックデータを使用します:', MOCK_TEMPLATES);
        setTemplates(MOCK_TEMPLATES);
        setRules(MOCK_RULES);
        
        toast.error('APIからのデータ取得に失敗しました。モックデータを使用します。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // フィルタリングされたテンプレートとルール
  console.log('フィルタリング前のテンプレート:', templates);
  
  const filteredTemplates = templates.filter(template => {
    console.log('フィルタリング中のテンプレート:', template);
    console.log('テンプレートのプロパティ:', Object.keys(template));
    
    if (!searchQuery) return true; // 検索クエリが空の場合は全て表示
    
    const nameMatch = template.name && (template.name.toLowerCase()).includes(searchQuery.toLowerCase());
    const messageMatch = template.message && (template.message.toLowerCase()).includes(searchQuery.toLowerCase());
    const categoryMatch = template.category && (template.category.toLowerCase()).includes(searchQuery.toLowerCase());
    
    console.log('name match:', nameMatch, 'message match:', messageMatch, 'category match:', categoryMatch);
    
    return nameMatch || messageMatch || categoryMatch;
  });
  
  console.log('フィルタリング後のテンプレート数:', filteredTemplates.length);
  
  const filteredRules = rules.filter(rule => 
    (rule.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (rule.value?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );
  
  // コンポーネントのトップレベルでUIに関するログを追加
  console.log('レンダリング - アクティブタブ:', activeTab);
  console.log('レンダリング - モックテンプレート:', MOCK_TEMPLATES);
  console.log('レンダリング - テンプレート状態:', templates);
  console.log('レンダリング - フィルタ済みテンプレート:', filteredTemplates);
  
  // テンプレート関連のハンドラ
  const handleTemplateStatusToggle = async (id: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (!template) return;
      
      // ローカル状態の更新
      const updatedTemplate = {...template, isActive: !template.isActive};
      
      setTemplates(prevTemplates => 
        prevTemplates.map(t => t.id === id ? updatedTemplate : t)
      );
      
      toast.success(`テンプレートの状態を変更しました`);
      
      // 開発環境でAPIが利用可能な場合のみ実行
      /*
      const updatedTemplate = await autoResponderService.templates.update(id, {
        ...template,
        isActive: !template.isActive
      });
      */
    } catch (err) {
      console.error('テンプレート状態更新エラー:', err);
      toast.error('テンプレートの状態変更に失敗しました');
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('このテンプレートを削除してもよろしいですか？')) {
      try {
        // ローカル状態の更新
        setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== id));
        toast.success(`テンプレートを削除しました`);
        
        // 開発環境でAPIが利用可能な場合のみ実行
        /*
        await autoResponderService.templates.delete(id);
        */
      } catch (err) {
        console.error('テンプレート削除エラー:', err);
        toast.error('テンプレートの削除に失敗しました');
      }
    }
  };

  const handleEditTemplate = (template: ResponseTemplate) => {
    console.log('編集するテンプレート:', template);
    setSelectedTemplate(template);
    setModalOpen(prev => {
      console.log('モーダルの状態を更新:', { ...prev, templateModal: true });
      return { ...prev, templateModal: true };
    });
  };

  const handleCreateTemplate = () => {
    console.log('新規テンプレート作成');
    setSelectedTemplate(null);
    setModalOpen(prev => {
      console.log('モーダルの状態を更新:', { ...prev, templateModal: true });
      return { ...prev, templateModal: true };
    });
  };

  const handleSaveTemplate = async (template: ResponseTemplate) => {
    try {
      console.log('保存するテンプレート:', template);
      
      let updatedTemplate;
      if (template.id) {
        // 既存テンプレート更新（ローカル）
        updatedTemplate = {
          ...template,
          updatedAt: new Date().toISOString()
        };
        setTemplates(prevTemplates => 
          prevTemplates.map(t => t.id === template.id ? updatedTemplate : t)
        );
        toast.success('テンプレートを更新しました');
      } else {
        // 新規テンプレート作成（ローカル）
        updatedTemplate = {
          ...template,
          id: String(Date.now()), // 一意のIDを生成
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          useCount: 0
        };
        setTemplates(prevTemplates => [...prevTemplates, updatedTemplate]);
        toast.success('テンプレートを作成しました');
      }
      
      // APIが利用可能な場合のみ実行
      /*
      if (template.id) {
        updatedTemplate = await autoResponderService.templates.update(template.id, template);
        setTemplates(prevTemplates => 
          prevTemplates.map(t => t.id === template.id ? updatedTemplate : t)
        );
        toast.success('テンプレートを更新しました');
      } else {
        updatedTemplate = await autoResponderService.templates.create(template);
        setTemplates(prevTemplates => [...prevTemplates, updatedTemplate]);
        toast.success('テンプレートを作成しました');
      }
      */
    } catch (err) {
      console.error('テンプレート保存エラー:', err);
      toast.error('テンプレートの保存に失敗しました');
    } finally {
      setModalOpen(prev => ({ ...prev, templateModal: false }));
    }
  };

  // ルール関連のハンドラ
  const handleRuleStatusToggle = async (id: string) => {
    try {
      const rule = rules.find(r => r.id === id);
      if (!rule) return;
      
      const updatedRule = await autoResponderService.rules.update(id, {
        ...rule,
        isActive: !rule.isActive
      });
      
      setRules(prevRules => 
        prevRules.map(r => r.id === id ? updatedRule : r)
      );
      
      toast.success(`ルールの状態を変更しました`);
    } catch (err) {
      console.error('ルール状態更新エラー:', err);
      toast.error('ルールの状態変更に失敗しました');
    }
  };
  
  const handleDeleteRule = async (id: string) => {
    if (window.confirm('このルールを削除してもよろしいですか？')) {
      try {
        await autoResponderService.rules.delete(id);
        setRules(prevRules => prevRules.filter(rule => rule.id !== id));
        toast.success(`ルールを削除しました`);
      } catch (err) {
        console.error('ルール削除エラー:', err);
        toast.error('ルールの削除に失敗しました');
      }
    }
  };

  const handleEditRule = (rule: ResponseRule) => {
    setSelectedRule(rule);
    setModalOpen(prev => ({ ...prev, ruleModal: true }));
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setModalOpen(prev => ({ ...prev, ruleModal: true }));
  };

  const handleSaveRule = async (rule: ResponseRule) => {
    try {
      let updatedRule;
      if (rule.id) {
        // 既存ルール更新
        updatedRule = await autoResponderService.rules.update(rule.id, rule);
        setRules(prevRules => 
          prevRules.map(r => r.id === rule.id ? updatedRule : r)
        );
        toast.success('ルールを更新しました');
      } else {
        // 新規ルール作成
        updatedRule = await autoResponderService.rules.create(rule);
        setRules(prevRules => [...prevRules, updatedRule]);
        toast.success('ルールを作成しました');
      }
    } catch (err) {
      console.error('ルール保存エラー:', err);
      toast.error('ルールの保存に失敗しました');
    } finally {
      setModalOpen(prev => ({ ...prev, ruleModal: false }));
    }
  };

  // テンプレートごとのカテゴリバッジを表示する関数
  const getCategoryBadge = (category: string) => {
    const categoryConfig = TEMPLATE_CATEGORIES.find(c => c.value === category);
    return (
      <span 
        className={`px-2 py-1 text-xs rounded-full ${categoryConfig?.color || 'bg-gray-100 text-gray-800'}`}
      >
        {categoryConfig?.label || category}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">自動応答管理</h1>
          <div className="space-x-4">
            <Link 
              href="/admin/fake-accounts" 
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              戻る
            </Link>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          サクラアカウントの自動メッセージ応答を管理します。テンプレートとルールを設定して自動化しましょう。
        </p>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              className="w-full px-4 py-2 border rounded-md pl-10"
            />
            <svg 
              className="w-5 h-5 absolute left-3 top-[10px] text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <TabsList className="mb-6">
            <TabsTrigger value="templates" className="flex-1">
              テンプレート管理
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex-1">
              ルール管理
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex-1">
              テスト
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex-1">
              ログ
            </TabsTrigger>
          </TabsList>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm underline text-red-700"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <>
              {/* デバッグ情報 */}
              <div className="bg-gray-100 p-2 text-xs mb-4 rounded">
                <p>Templates: {templates.length} / Filtered: {filteredTemplates.length}</p>
                <p>Active tab: {activeTab}</p>
                <p>Modal open state: {JSON.stringify(modalOpen)}</p>
              </div>
              
              <TabsContent value="templates">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      console.log('新規テンプレート作成ボタンがクリックされました');
                      handleCreateTemplate();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    ＋ 新規テンプレート作成
                  </button>
                </div>
                
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    テンプレートが見つかりません
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg transition-colors ${
                          template.isActive ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-medium">{template.name}</h3>
                              {getCategoryBadge(template.category)}
                              {!template.isActive && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                                  無効
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {template.message}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTemplateStatusToggle(template.id)}
                              className="p-2 rounded hover:bg-gray-100 transition-colors"
                              title={template.isActive ? '無効にする' : '有効にする'}
                            >
                              {template.isActive ? (
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                console.log('編集ボタンがクリックされました:', template);
                                handleEditTemplate(template);
                              }}
                              className="p-2 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                              title="編集"
                            >
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-2 rounded hover:bg-gray-100 transition-colors"
                              title="削除"
                            >
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rules">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleCreateRule}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    新規ルール作成
                  </button>
                </div>
                
                {filteredRules.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    ルールが見つかりません
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRules.map((rule) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg transition-colors ${
                          rule.isActive ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-medium">{rule.name}</h3>
                              {!rule.isActive && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                                  無効
                                </span>
                              )}
                              {rule.priority !== undefined && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                  優先度: {rule.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {rule.value}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRuleStatusToggle(rule.id)}
                              className="p-2 rounded hover:bg-gray-100 transition-colors"
                              title={rule.isActive ? '無効にする' : '有効にする'}
                            >
                              {rule.isActive ? (
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleEditRule(rule)}
                              className="p-2 rounded hover:bg-gray-100 transition-colors"
                              title="編集"
                            >
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-2 rounded hover:bg-gray-100 transition-colors"
                              title="削除"
                            >
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="testing">
                <TestingPanel templates={templates} rules={rules} />
              </TabsContent>
              <TabsContent value="logs">
                <ResponseLogger />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      
      {/* テンプレート編集モーダル */}
      {modalOpen.templateModal && (
        <TemplateEditModal
          isOpen={modalOpen.templateModal}
          onClose={() => {
            console.log('モーダルを閉じます');
            setModalOpen(prev => ({ ...prev, templateModal: false }));
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSave={handleSaveTemplate}
        />
      )}
      
      {/* ルール編集モーダル */}
      {modalOpen.ruleModal && (
        <RuleEditModal
          isOpen={modalOpen.ruleModal}
          onClose={() => {
            console.log('モーダルを閉じます');
            setModalOpen(prev => ({ ...prev, ruleModal: false }));
            setSelectedRule(null);
          }}
          rule={selectedRule}
          onSave={handleSaveRule}
        />
      )}
    </div>
  );
}

export default withAdminAuth(AutoResponderPage);
