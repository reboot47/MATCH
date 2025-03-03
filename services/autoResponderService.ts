import axios, { AxiosInstance } from 'axios';
import { ResponseTemplate, ResponseRule } from '../app/admin/fake-accounts/auto-responder/types';

// テンプレート関連のAPI操作
const templateApi = {
  // テンプレート一覧取得
  getAll: async (): Promise<ResponseTemplate[]> => {
    try {
      const response = await axios.get('/api/admin/auto-responder/templates');
      return response.data;
    } catch (error) {
      console.error('テンプレート取得エラー:', error);
      throw error;
    }
  },

  // テンプレート取得
  getById: async (id: string): Promise<ResponseTemplate> => {
    try {
      const response = await axios.get(`/api/admin/auto-responder/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`テンプレート(ID: ${id})取得エラー:`, error);
      throw error;
    }
  },

  // テンプレート作成
  create: async (template: Omit<ResponseTemplate, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>): Promise<ResponseTemplate> => {
    try {
      const response = await axios.post('/api/admin/auto-responder/templates', template);
      return response.data;
    } catch (error) {
      console.error('テンプレート作成エラー:', error);
      throw error;
    }
  },

  // テンプレート更新
  update: async (id: string, template: Partial<ResponseTemplate>): Promise<ResponseTemplate> => {
    try {
      const response = await axios.put(`/api/admin/auto-responder/templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error(`テンプレート(ID: ${id})更新エラー:`, error);
      throw error;
    }
  },

  // テンプレート削除
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/admin/auto-responder/templates/${id}`);
    } catch (error) {
      console.error(`テンプレート(ID: ${id})削除エラー:`, error);
      throw error;
    }
  }
};

// ルール関連のAPI操作
const ruleApi = {
  // ルール一覧取得
  getAll: async (): Promise<ResponseRule[]> => {
    try {
      const response = await axios.get('/api/admin/auto-responder/rules');
      return response.data;
    } catch (error) {
      console.error('ルール取得エラー:', error);
      throw error;
    }
  },

  // ルール取得
  getById: async (id: string): Promise<ResponseRule> => {
    try {
      const response = await axios.get(`/api/admin/auto-responder/rules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ルール(ID: ${id})取得エラー:`, error);
      throw error;
    }
  },

  // ルール作成
  create: async (rule: Omit<ResponseRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResponseRule> => {
    try {
      const response = await axios.post('/api/admin/auto-responder/rules', rule);
      return response.data;
    } catch (error) {
      console.error('ルール作成エラー:', error);
      throw error;
    }
  },

  // ルール更新
  update: async (id: string, rule: Partial<ResponseRule>): Promise<ResponseRule> => {
    try {
      const response = await axios.put(`/api/admin/auto-responder/rules/${id}`, rule);
      return response.data;
    } catch (error) {
      console.error(`ルール(ID: ${id})更新エラー:`, error);
      throw error;
    }
  },

  // ルール削除
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/admin/auto-responder/rules/${id}`);
    } catch (error) {
      console.error(`ルール(ID: ${id})削除エラー:`, error);
      throw error;
    }
  }
};

// 自動応答サービスのエクスポート
const autoResponderService = {
  templates: templateApi,
  rules: ruleApi
};

export default autoResponderService;
