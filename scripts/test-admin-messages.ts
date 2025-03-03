// 管理者メッセージAPI テストスクリプト
import { PrismaClient } from '@prisma/client';

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

/**
 * メッセージ管理APIのテスト関数
 */
async function testAdminMessagesApi() {
  console.log('🧪 メッセージ管理APIテストを開始します...');
  
  try {
    // フラグ付きメッセージの確認
    console.log('\n🚩 フラグ付きメッセージの確認:');
    const flaggedMessages = await prisma.message.findMany({
      where: { isFlagged: true },
      include: {
        sender: true,
        receiver: true
      }
    });
    
    console.log(`  - フラグ付きメッセージ数: ${flaggedMessages.length}`);
    if (flaggedMessages.length > 0) {
      console.log('  - 例: ', flaggedMessages[0].content.substring(0, 50), '...');
    }
    
    // ブロック済みメッセージの確認
    console.log('\n🔒 ブロック済みメッセージの確認:');
    const blockedMessages = await prisma.message.findMany({
      where: { isBlockedBySystem: true },
      include: {
        sender: true,
        receiver: true
      }
    });
    
    console.log(`  - ブロック済みメッセージ数: ${blockedMessages.length}`);
    if (blockedMessages.length > 0) {
      console.log('  - 例: ', blockedMessages[0].content.substring(0, 50), '...');
    }
    
    // メッセージのフラグ付け機能テスト
    console.log('\n🚩 メッセージのフラグ付けテスト:');
    const messageToFlag = await findMessageForAction(false, false);
    
    if (messageToFlag) {
      console.log(`  - メッセージID: ${messageToFlag.id} をフラグ付けします`);
      
      // メッセージをフラグ付け
      await prisma.message.update({
        where: { id: messageToFlag.id },
        data: { 
          isFlagged: true,
          flagReason: 'テスト用フラグ',
          flaggedBy: 'admin',
          flagTimestamp: new Date()
        }
      });
      
      // 更新を確認
      const updatedMessage = await prisma.message.findUnique({
        where: { id: messageToFlag.id }
      });
      
      if (updatedMessage?.isFlagged) {
        console.log('  - ✅ メッセージのフラグ付けに成功しました');
      } else {
        console.log('  - ❌ メッセージのフラグ付けに失敗しました');
      }
    } else {
      console.log('  - フラグ付けテスト用のメッセージが見つかりませんでした');
    }
    
    // メッセージのブロック機能テスト
    console.log('\n🔒 メッセージのブロックテスト:');
    const messageToBlock = await findMessageForAction(true, false);
    
    if (messageToBlock) {
      console.log(`  - メッセージID: ${messageToBlock.id} をブロックします`);
      
      // メッセージをブロック
      await prisma.message.update({
        where: { id: messageToBlock.id },
        data: { 
          isBlockedBySystem: true,
          blockReason: 'テスト用ブロック',
          reviewedBy: 'admin',
          reviewTimestamp: new Date()
        }
      });
      
      // 更新を確認
      const updatedMessage = await prisma.message.findUnique({
        where: { id: messageToBlock.id }
      });
      
      if (updatedMessage?.isBlockedBySystem) {
        console.log('  - ✅ メッセージのブロックに成功しました');
      } else {
        console.log('  - ❌ メッセージのブロックに失敗しました');
      }
    } else {
      console.log('  - ブロックテスト用のメッセージが見つかりませんでした');
    }
    
    console.log('\n✅ すべてのテストが完了しました');
  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// テスト用メッセージを見つける
async function findMessageForAction(flagged: boolean, blocked: boolean) {
  try {
    const message = await prisma.message.findFirst({
      where: {
        isFlagged: flagged,
        isBlockedBySystem: blocked
      }
    });
    
    return message;
  } catch (error) {
    console.error('メッセージ検索中にエラーが発生しました:', error);
    return null;
  }
}

// メイン実行
testAdminMessagesApi().catch(console.error);
