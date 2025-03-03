// 自動応答テンプレートのインターフェース
export interface ResponseTemplate {
  id: string;
  name: string;
  message: string;
  category: string;
  useCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// 自動応答ルールのインターフェース
export interface ResponseRule {
  id: string;
  name: string;
  condition: {
    type: string; // 'message_received', 'time_elapsed', 'user_profile', 'match_new'
    value: string;
    operator?: string; // 'contains', 'equals', 'greater_than', 'less_than', 'regex'
  };
  type?: string; 
  value?: string; 
  operator?: string;
  templateIds: string[];
  delay: number;
  probability: number;
  isActive: boolean;
  accountIds: string[];
  createdAt: string;
  updatedAt: string;
}

// テンプレートカテゴリの定義
export interface TemplateCategory {
  name: string;
  description: string;
  examples: string[];
}
