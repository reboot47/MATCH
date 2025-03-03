// test-env-api.js
// 環境変数確認APIをテストするスクリプト

const axios = require('axios');

async function testEnvApi() {
  try {
    console.log('🔍 環境変数確認APIをテスト中...');
    
    const response = await axios.get('http://localhost:3000/api/admin/env');
    
    console.log('\n✅ APIレスポンス:');
    console.log(`ステータス: ${response.status}`);
    
    const data = response.data;
    console.log(`APIステータス: ${data.status}`);
    console.log(`メッセージ: ${data.message}`);
    
    if (data.env) {
      console.log('\n--- 環境変数 ---');
      Object.entries(data.env).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    }
    
    if (data.processEnv) {
      console.log('\n--- プロセス環境変数 ---');
      Object.entries(data.processEnv).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    }
    
  } catch (error) {
    console.error('❌ APIテストエラー:');
    if (error.response) {
      // サーバーからのレスポンスがあるエラー
      console.error(`ステータス: ${error.response.status}`);
      console.error('レスポンスデータ:', error.response.data);
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      console.error('レスポンスが受信できませんでした');
    } else {
      // リクエスト設定時に何か問題が発生
      console.error(`エラーメッセージ: ${error.message}`);
    }
  }
}

testEnvApi();
