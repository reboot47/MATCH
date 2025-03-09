import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 ユーザーデータ修復を開始します...');

  // 現在の認証されたユーザーID
  const userId = '83199a88-6f51-433a-876a-848378ba225d';
  const userName = '糸数秀生';
  const userEmail = 'wamwam55@gmail.com';

  try {
    // ユーザーが存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      console.log(`✅ ユーザーが既に存在します: ${existingUser.name} (${existingUser.id})`);
    } else {
      // ユーザーが存在しない場合は作成
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          name: userName,
          email: userEmail,
          hashedPassword: await hash('password123', 10), // 仮のパスワード
          bio: 'このユーザーは自動修復スクリプトによって作成されました。',
          emailVerified: new Date(),
        }
      });
      console.log(`✅ 新しいユーザーを作成しました: ${newUser.name} (${newUser.id})`);
    }

    // UserPrivacyが存在するか確認
    const existingPrivacy = await prisma.userPrivacy.findUnique({
      where: { userId: userId }
    });

    if (existingPrivacy) {
      console.log(`✅ ユーザープライバシー設定が既に存在します (${existingPrivacy.id})`);
    } else {
      // UserPrivacyが存在しない場合は作成
      const newPrivacy = await prisma.userPrivacy.create({
        data: {
          userId: userId,
          profileVisibility: 'public',
        }
      });
      console.log(`✅ 新しいユーザープライバシー設定を作成しました (${newPrivacy.id})`);
    }

    console.log('🎉 ユーザーデータ修復が完了しました');
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
