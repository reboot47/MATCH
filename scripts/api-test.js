// api-test.js
const axios = require('axios');

async function testApi() {
  console.log('管理者APIテスト開始...');
  
  try {
    console.log('\n1. メッセージAPI (/api/admin/messages) テスト:');
    const messagesResponse = await axios.get('http://localhost:3000/api/admin/messages');
    
    const messagesData = messagesResponse.data;
    console.log(`API応答ステータス: ${messagesResponse.status}`);
    console.log(`総メッセージ数: ${messagesData.total}`);
    console.log(`返されたメッセージ数: ${messagesData.messages?.length || 0}`);
    
    if (messagesData.messages && messagesData.messages.length > 0) {
      console.log('\n最初のメッセージサンプル:');
      const sample = messagesData.messages[0];
      console.log(`- ID: ${sample.id}`);
      console.log(`- 送信者: ${sample.senderName} (${sample.senderId})`);
      console.log(`- 受信者: ${sample.receiverName} (${sample.receiverId})`);
      console.log(`- 内容: ${sample.content.substring(0, 30)}...`);
      console.log(`- 日時: ${sample.timestamp}`);
    } else {
      console.log('メッセージが返されませんでした。');
    }
    
  } catch (error) {
    console.error('APIテスト失敗:', error.message);
    if (error.response) {
      console.error(`ステータス: ${error.response.status}`);
      console.error('応答データ:', error.response.data);
    }
  }
}

testApi();
