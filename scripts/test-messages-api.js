// test-messages-api.js
// 管理者メッセージAPIをテストするスクリプト

const fetch = require('node-fetch');

async function testMessagesAPI() {
  console.log('📮 管理者メッセージAPIテストスクリプト');
  console.log('------------------------------------------');

  // 環境変数からAPIのベースURLを取得（デフォルトはローカルホスト）
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  console.log(`📍 API Base URL: ${baseUrl}`);

  try {
    // GET: メッセージ一覧を取得
    console.log('\n1️⃣ GETリクエスト: メッセージ一覧の取得');
    const getResponse = await fetch(`${baseUrl}/api/admin/messages`);
    
    if (!getResponse.ok) {
      throw new Error(`GETリクエストエラー: ${getResponse.status} ${getResponse.statusText}`);
    }
    
    const getData = await getResponse.json();
    console.log('✅ GETレスポンス:');
    console.log('📊 ページネーション情報:', getData.pagination);
    console.log(`📝 メッセージ数: ${getData.messages.length}`);
    
    if (getData.messages.length > 0) {
      // サンプルとして最初のメッセージを表示
      const sampleMessage = getData.messages[0];
      console.log('📝 サンプルメッセージ:');
      console.log(`  ID: ${sampleMessage.id}`);
      console.log(`  内容: ${sampleMessage.content}`);
      console.log(`  送信者: ${sampleMessage.sender?.name || 'Unknown'} (${sampleMessage.senderId})`);
      console.log(`  受信者: ${sampleMessage.receiver?.name || 'Unknown'} (${sampleMessage.receiverId})`);
      console.log(`  作成日時: ${new Date(sampleMessage.createdAt).toLocaleString()}`);
      console.log(`  既読: ${sampleMessage.read ? 'はい' : 'いいえ'}`);
      
      // PATCH: 最初のメッセージの内容を更新
      const messageId = sampleMessage.id;
      console.log('\n2️⃣ PATCHリクエスト: メッセージ内容の更新');
      console.log(`  更新対象ID: ${messageId}`);
      
      const patchResponse = await fetch(`${baseUrl}/api/admin/messages`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId,
          content: 'この内容は管理者APIによって更新されました',
          read: true
        }),
      });
      
      if (!patchResponse.ok) {
        throw new Error(`PATCHリクエストエラー: ${patchResponse.status} ${patchResponse.statusText}`);
      }
      
      const patchData = await patchResponse.json();
      console.log('✅ PATCHレスポンス:');
      console.log(`  ID: ${patchData.id}`);
      console.log(`  更新後の内容: ${patchData.content}`);
      console.log(`  更新日時: ${new Date(patchData.updatedAt).toLocaleString()}`);
      console.log(`  既読: ${patchData.read ? 'はい' : 'いいえ'}`);
      
      // DELETE: 最後のメッセージを削除 (テスト用にコメントアウト)
      /*
      if (getData.messages.length > 1) {
        const lastMessage = getData.messages[getData.messages.length - 1];
        const deleteId = lastMessage.id;
        
        console.log('\n3️⃣ DELETEリクエスト: メッセージの削除');
        console.log(`  削除対象ID: ${deleteId}`);
        
        const deleteResponse = await fetch(`${baseUrl}/api/admin/messages?id=${deleteId}`, {
          method: 'DELETE',
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`DELETEリクエストエラー: ${deleteResponse.status} ${deleteResponse.statusText}`);
        }
        
        const deleteData = await deleteResponse.json();
        console.log('✅ DELETEレスポンス:');
        console.log(deleteData);
      }
      */
      
      // フィルター付きGETリクエスト
      console.log('\n4️⃣ フィルター付きGETリクエスト:');
      const filterParams = new URLSearchParams({
        page: '1',
        limit: '5',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (sampleMessage.senderId) {
        filterParams.append('userId', sampleMessage.senderId);
        console.log(`  ユーザーIDフィルター: ${sampleMessage.senderId}`);
      }
      
      const filteredResponse = await fetch(`${baseUrl}/api/admin/messages?${filterParams.toString()}`);
      
      if (!filteredResponse.ok) {
        throw new Error(`フィルター付きGETリクエストエラー: ${filteredResponse.status} ${filteredResponse.statusText}`);
      }
      
      const filteredData = await filteredResponse.json();
      console.log('✅ フィルター付きGETレスポンス:');
      console.log(`  メッセージ数: ${filteredData.messages.length}`);
      console.log('  ページネーション情報:', filteredData.pagination);
    } else {
      console.log('⚠️ メッセージが見つかりませんでした');
    }
    
  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error);
  }
  
  console.log('\n------------------------------------------');
  console.log('🏁 テスト完了');
}

testMessagesAPI();
