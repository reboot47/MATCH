import { TEMPLATE_VARIABLES } from './constants';
import { ResponseTemplate, ResponseRule } from './types';

/**
 * テンプレート内の変数を実際の値に置き換える
 * @param template テンプレート文字列
 * @param variables 変数マッピング
 * @returns 変数が置き換えられたテンプレート文字列
 */
export const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template;
  // すべての変数を実際の値に置き換える
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  
  // 置き換えられなかった変数を空文字列に置き換える
  TEMPLATE_VARIABLES.forEach(variable => {
    const regex = new RegExp(variable.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, '');
  });
  
  return result;
};

/**
 * テンプレート内の変数を検出する
 * @param template テンプレート文字列
 * @returns テンプレート内の変数リスト
 */
export const detectTemplateVariables = (template: string): string[] => {
  const variables: string[] = [];
  
  TEMPLATE_VARIABLES.forEach(variable => {
    if (template.includes(variable.name)) {
      variables.push(variable.name);
    }
  });
  
  return variables;
};

/**
 * 複数の自動応答ルールを評価し、条件に合致するルールを返す
 * @param rules 評価するルールのリスト
 * @param context 評価コンテキスト
 * @returns 条件に合致するルールのリスト
 */
export const evaluateRules = (
  rules: ResponseRule[],
  context: {
    message?: string;
    userProfile?: Record<string, any>;
    timeElapsed?: number;
    isNewMatch?: boolean;
  }
): ResponseRule[] => {
  return rules.filter(rule => evaluateRule(rule, context));
};

/**
 * 自動応答ルールを評価し、条件に合致するかを判定する
 * @param rule 評価するルール
 * @param context 評価コンテキスト
 * @returns 条件に合致する場合はtrue
 */
export const evaluateRule = (
  rule: ResponseRule,
  context: {
    message?: string;
    userProfile?: Record<string, any>;
    timeElapsed?: number;
    isNewMatch?: boolean;
  }
): boolean => {
  // 簡易的な評価ロジック（実際のアプリではより複雑になる）
  switch (rule.conditionType) {
    case 'match_new':
      return !!context.isNewMatch;
    
    case 'message_received':
      if (!context.message) return false;
      
      switch (rule.operator) {
        case 'equals':
          return context.message === rule.value;
        case 'contains':
          return context.message.includes(rule.value || '');
        case 'regex':
          try {
            const regex = new RegExp(rule.value || '');
            return regex.test(context.message);
          } catch (error) {
            console.error('Invalid regex in rule:', error);
            return false;
          }
        default:
          return false;
      }
    
    case 'time_elapsed':
      if (context.timeElapsed === undefined) return false;
      
      switch (rule.operator) {
        case 'greater_than':
          return context.timeElapsed > Number(rule.value || 0);
        case 'less_than':
          return context.timeElapsed < Number(rule.value || 0);
        default:
          return false;
      }
    
    case 'user_profile':
      if (!context.userProfile || !rule.field) return false;
      
      const fieldValue = context.userProfile[rule.field];
      if (fieldValue === undefined) return false;
      
      switch (rule.operator) {
        case 'equals':
          return String(fieldValue) === rule.value;
        case 'contains':
          return String(fieldValue).includes(rule.value || '');
        case 'regex':
          try {
            const regex = new RegExp(rule.value || '');
            return regex.test(String(fieldValue));
          } catch (error) {
            console.error('Invalid regex in rule:', error);
            return false;
          }
        default:
          return false;
      }
    
    case 'no_response':
      return true; // 簡易実装。実際にはメッセージの応答状態を検証
    
    default:
      return false;
  }
};

/**
 * ルールに基づいて、適切なテンプレートを選択する
 * @param rules 全ルール
 * @param templates 全テンプレート
 * @param context 評価コンテキスト
 * @returns 適用可能なテンプレート
 */
export const selectTemplateByRules = (
  rules: ResponseRule[],
  templates: ResponseTemplate[],
  context: {
    message?: string;
    userProfile?: Record<string, any>;
    timeElapsed?: number;
    isNewMatch?: boolean;
  }
): ResponseTemplate | null => {
  // ルールに一致するテンプレートを探す
  for (const rule of rules) {
    if (evaluateRule(rule, context)) {
      // ルールに関連付けられたテンプレートを返す
      if (rule.templateId) {
        const template = templates.find(t => t.id === rule.templateId);
        if (template) return template;
      }
    }
  }
  
  return null;
};
