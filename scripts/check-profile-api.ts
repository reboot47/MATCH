import { PrismaClient } from '@prisma/client';
import axios from 'axios';

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 プロフィールAPI診断を開始します...');

  // ユーザーID
  const userId = '83199a88-6f51-433a-876a-848378ba225d';

  try {
    // データベースからユーザーを直接取得
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        privacy: true
      }
    });

    console.log('データベースからのユーザー情報:');
    console.log(JSON.stringify(dbUser, null, 2));

    // データベースからユーザープライバシーを直接取得
    const dbPrivacy = await prisma.userPrivacy.findUnique({
      where: { userId: userId }
    });

    console.log('データベースからのプライバシー情報:');
    console.log(JSON.stringify(dbPrivacy, null, 2));

    console.log('🎉 プロフィールAPI診断が完了しました');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
