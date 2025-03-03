// test-debug-api.js
// デバッグAPIをテストするためのスクリプト

const axios = require('axios');

async function testDebugApi() {
  try {
    console.log('🔍 デバッグAPIをテスト中...');
    
    const response = await axios.get('http://localhost:3000/api/admin/debug');
    
    console.log('\n✅ APIレスポンス:');
    console.log(`ステータス: ${response.status}`);
    
    const data = response.data;
    console.log(`APIステータス: ${data.status}`);
    console.log(`メッセージ: ${data.message}`);
    
    if (data.data) {
      const debugInfo = data.data;
      
      console.log('\n--- 環境情報 ---');
      console.log(`タイムスタンプ: ${debugInfo.timestamp}`);
      console.log(`NODE_ENV: ${debugInfo.environment.nodeEnv}`);
      console.log(`DATABASE_URL: ${debugInfo.environment.databaseUrl}`);
      
      console.log('\n--- データベース情報 ---');
      console.log(`Messageテーブル存在: ${debugInfo.database.tableExists}`);
      console.log('メッセージ数:');
      console.log(`- SQL Raw: ${debugInfo.database.messageCount.raw}`);
      console.log(`- Prisma ORM: ${debugInfo.database.messageCount.orm}`);
      console.log(`ユーザー数: ${debugInfo.database.userCount}`);
      console.log(`マッチ数: ${debugInfo.database.matchCount}`);
      
      console.log('\nメッセージスキーマ:');
      debugInfo.database.messageSchema.forEach(col => {
        console.log(`- ${col.name}: ${col.type}`);
      });
      
      console.log('\n最新のメッセージ:');
      if (debugInfo.database.latestMessage) {
        const msg = debugInfo.database.latestMessage;
        console.log(`ID: ${msg.id}`);
        console.log(`内容: ${msg.content}`);
        console.log(`作成日時: ${msg.createdAt}`);
        console.log(`送信者: ${msg.sender.name} (${msg.sender.id})`);
        console.log(`受信者: ${msg.receiver.name} (${msg.receiver.id})`);
      } else {
        console.log('最新メッセージが見つかりません');
      }
      
      console.log('\nすべてのメッセージID:');
      if (debugInfo.database.allMessageIds && debugInfo.database.allMessageIds.length > 0) {
        debugInfo.database.allMessageIds.forEach((msg, index) => {
          console.log(`${index + 1}. ID: ${msg.id}, 内容: ${msg.content.substring(0, 30)}${msg.content.length > 30 ? '...' : ''}`);
        });
      } else {
        console.log('メッセージが見つかりません');
      }
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

testDebugApi();
