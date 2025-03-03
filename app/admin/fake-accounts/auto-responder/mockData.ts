import { ResponseTemplate, ResponseRule } from './types';

// サンプルテンプレート
export const MOCK_TEMPLATES: ResponseTemplate[] = [
  {
    id: '1',
    name: '初回マッチ挨拶',
    message: 'こんにちは、{{user_name}}さん！マッチしてくれてありがとう！\n私のプロフィールを見てくれたんだね、嬉しいです😊\nよかったら{{user_name}}さんのことも教えてほしいな。',
    category: 'greeting',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
    isActive: true,
    useCount: 0,
  },
  {
    id: '2',
    name: '週末の誘い',
    message: '今週末、もし時間あったら{{location}}で{{hobby}}でもどう？\n{{user_name}}さんと一緒に過ごせたら楽しそう！',
    category: 'invitation',
    createdAt: '2025-03-01T11:00:00Z',
    updatedAt: '2025-03-01T11:00:00Z',
    isActive: true,
    useCount: 0,
  },
  {
    id: '3',
    name: '質問返し',
    message: '{{user_name}}さんは{{hobby}}が好きなんだね！\n私も最近ハマってるよ。特に{{location}}でするのが好きなんだ。\n{{user_name}}さんはどんなところが好き？',
    category: 'question',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-01T12:00:00Z',
    isActive: true,
    useCount: 0,
  },
  {
    id: '4', 
    name: '趣味の話題',
    message: '私は最近{{hobby}}を始めたんだ。まだ初心者だけど、楽しんでるよ！\n{{user_name}}さんは何か趣味とかあるの？',
    category: 'hobby',
    createdAt: '2025-03-01T13:00:00Z',
    updatedAt: '2025-03-01T13:00:00Z',
    isActive: true,
    useCount: 0,
  },
  {
    id: '5',
    name: 'デートの提案',
    message: '{{user_name}}さんとお話してて本当に楽しいな😊\n良かったら今度{{location}}で会ってみない？',
    category: 'invitation',
    createdAt: '2025-03-01T14:00:00Z',
    updatedAt: '2025-03-01T14:00:00Z',
    isActive: true,
    useCount: 0,
  }
];

// サンプルルール
export const MOCK_RULES: ResponseRule[] = [
  {
    id: '1',
    name: '初回メッセージルール',
    condition: 'first_message',
    value: 'true',
    templateId: '1',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
    isActive: true,
    priority: 10,
  },
  {
    id: '2',
    name: '趣味に関する質問への返答',
    condition: 'message_contains',
    value: '趣味,好きなこと,ハマってる',
    templateId: '3',
    createdAt: '2025-03-01T11:00:00Z',
    updatedAt: '2025-03-01T11:00:00Z',
    isActive: true,
    priority: 5,
  },
  {
    id: '3',
    name: '週末の予定への返答',
    condition: 'message_contains',
    value: '週末,休み,予定',
    templateId: '2',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-01T12:00:00Z',
    isActive: true,
    priority: 3,
  }
];
