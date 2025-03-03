const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('ユーザーデータの生成を開始します...');

    // サンプルユーザーデータ
    const userData = [
      {
        name: '田中太郎',
        email: 'tanaka@example.com',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        emailVerified: new Date(),
        role: 'USER',
      },
      {
        name: '佐藤花子',
        email: 'sato@example.com',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        emailVerified: new Date(),
        role: 'USER',
      },
      {
        name: '山田次郎',
        email: 'yamada@example.com',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        emailVerified: new Date(),
        role: 'USER',
      },
      {
        name: '鈴木めぐみ',
        email: 'suzuki@example.com',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        emailVerified: new Date(),
        role: 'USER',
      },
      {
        name: '管理者',
        email: 'admin@example.com',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
        emailVerified: new Date(),
        role: 'ADMIN',
      }
    ];

    // ユーザーをデータベースに登録
    for (const user of userData) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      });
    }

    console.log(`${userData.length}人のユーザーを作成しました`);
    
    return true;
  } catch (error) {
    console.error('ユーザーデータの生成中にエラーが発生しました:', error);
    return false;
  }
}

async function main() {
  try {
    // ユーザーを作成
    const usersCreated = await createUsers();
    
    if (!usersCreated) {
      console.log('ユーザー作成に失敗したため、処理を中止します。');
      return;
    }
    
    console.log('テストデータの生成が完了しました！');
  } catch (error) {
    console.error('テストデータの生成中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
