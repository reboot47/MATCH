"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiChevronLeft, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { useUser } from '@/components/UserContext';

type MessageTemplate = {
  id: string;
  title: string;
  content: string;
  isDefault?: boolean;
};

export default function MessageTemplatesPage() {
  const router = useRouter();
  const userContext = useUser();
  const isMale = userContext?.isGenderMale() ?? false;
  
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<MessageTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

  useEffect(() => {
    // 実際のアプリではAPIからテンプレートを取得
    const fetchTemplates = async () => {
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // モックデータ
      const mockTemplates: MessageTemplate[] = [
        {
          id: '1',
          title: 'テンプレート1',
          content: '西梅田あたりに来る時気になら連絡ください\nいつでもいいですよ',
          isDefault: true
        },
        {
          id: '2',
          title: '挨拶',
          content: 'はじめまして！プロフィール拝見しました。\n趣味が似ていて親近感が湧きました。よろしければお話ししませんか？',
        },
        {
          id: '3',
          title: 'デート誘い',
          content: 'お話していて楽しいです！\n良かったら今度お茶でもしませんか？',
        },
        {
          id: '4',
          title: '返信お礼',
          content: 'メッセージありがとうございます！\nお返事遅くなってすみません。',
        }
      ];
      
      setTemplates(mockTemplates);
      setActiveTemplate(mockTemplates[0]);
      setTitle(mockTemplates[0].title);
      setContent(mockTemplates[0].content);
    };
    
    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template: MessageTemplate, index: number) => {
    setActiveTemplate(template);
    setTitle(template.title);
    setContent(template.content);
    setActiveTemplateIndex(index);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    if (activeTemplate) {
      // 既存テンプレートの更新
      const updatedTemplates = [...templates];
      updatedTemplates[activeTemplateIndex] = {
        ...activeTemplate,
        title,
        content
      };
      setTemplates(updatedTemplates);
      setActiveTemplate({...activeTemplate, title, content});
    } else {
      // 新規テンプレートの追加
      const newTemplate: MessageTemplate = {
        id: `template-${Date.now()}`,
        title,
        content
      };
      setTemplates([...templates, newTemplate]);
      setActiveTemplate(newTemplate);
      setActiveTemplateIndex(templates.length);
    }
    
    setIsEditing(false);
  };

  const handleDelete = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    
    if (activeTemplate?.id === templateId) {
      if (updatedTemplates.length > 0) {
        setActiveTemplate(updatedTemplates[0]);
        setTitle(updatedTemplates[0].title);
        setContent(updatedTemplates[0].content);
        setActiveTemplateIndex(0);
      } else {
        setActiveTemplate(null);
        setTitle('');
        setContent('');
      }
    }
  };

  const handleAddNew = () => {
    setActiveTemplate(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  // 残りの文字数計算
  const remainingChars = 99 - title.length;
  const remainingContentChars = 219 - content.length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()} 
          className="mr-4 text-gray-600"
          aria-label="戻る"
        >
          <HiChevronLeft size={24} />
        </button>
        <h1 className="text-center flex-grow font-medium text-lg">メッセージテンプレート</h1>
        <div className="w-8"></div> {/* バランスのためのスペース */}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto mt-4">
          <div className="bg-white rounded-lg shadow-sm">
            {/* テンプレート選択タブ */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {templates.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template, index)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeTemplate?.id === template.id 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddNew}
                  className="p-2 text-teal-500 hover:bg-teal-50 rounded-full"
                >
                  <HiPlus size={20} />
                </button>
              </div>
            </div>

            {/* テンプレート編集エリア */}
            <div className="p-4">
              {isEditing ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={99}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="テンプレートのタイトルを入力"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      あと{remainingChars}文字
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">内容 <span className="text-red-500">必須</span></label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={219}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="メッセージ本文を入力してください"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      あと{remainingContentChars}文字
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-4">
                    <p className="mb-1">① 挨拶は、本文のメッセージと同時に送信されます。</p>
                    <p className="mb-1">初回メッセージでは、挨拶と本文を送信することでお相手からの返信率がUPします！</p>
                    <p>② 文中に@@を入力すると、お相手の名前が自動で挿入されます！</p>
                    <p className="text-xs text-gray-500">例：「@@さん、はじめまして」→「たろうさん、はじめまして」</p>
                    <p className="text-xs text-gray-500">※ @@は半角・全角どちらでも可能です。</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!title.trim() || !content.trim()}
                      className={`px-4 py-2 rounded-md text-white ${
                        !title.trim() || !content.trim() 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-teal-500 hover:bg-teal-600'
                      }`}
                    >
                      保存する
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium flex items-center">
                      {activeTemplate?.title}
                      {activeTemplate?.isDefault && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          デフォルト
                        </span>
                      )}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-teal-500 hover:bg-teal-50 rounded"
                      >
                        <HiPencil size={18} />
                      </button>
                      {!activeTemplate?.isDefault && (
                        <button
                          onClick={() => activeTemplate && handleDelete(activeTemplate.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <HiTrash size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-4 whitespace-pre-wrap">
                    {activeTemplate?.content}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">① 挨拶は、本文のメッセージと同時に送信されます。</p>
                    <p className="mb-1">初回メッセージでは、挨拶と本文を送信することでお相手からの返信率がUPします！</p>
                    <p>② 文中に@@を入力すると、お相手の名前が自動で挿入されます！</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
