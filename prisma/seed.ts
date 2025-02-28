import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // テストユーザーの作成
    const hashedPassword = await hash('password', 12)
    
    // テストユーザー1（男性）
    const male = await prisma.user.upsert({
      where: { email: 'male@example.com' },
      update: {},
      create: {
        name: '山田太郎',
        email: 'male@example.com',
        hashedPassword,
        gender: 'MALE',
        birthdate: new Date('1990-01-15'),
        profile: {
          create: {
            height: 175,
            occupation: 'エンジニア',
            location: '東京都',
            bio: 'よろしくお願いします！',
            drinking: 'SOMETIMES',
            smoking: 'NO',
            education: 'UNIVERSITY',
            languages: ['日本語', '英語'],
            personality: ['明るい', '誠実']
          }
        }
      }
    })
    
    // テストユーザー2（女性）
    const female = await prisma.user.upsert({
      where: { email: 'female@example.com' },
      update: {},
      create: {
        name: '佐藤花子',
        email: 'female@example.com',
        hashedPassword,
        gender: 'FEMALE',
        birthdate: new Date('1995-05-20'),
        profile: {
          create: {
            height: 162,
            occupation: 'デザイナー',
            location: '東京都',
            bio: 'よろしくお願いします！',
            drinking: 'RARELY',
            smoking: 'NO',
            education: 'UNIVERSITY',
            languages: ['日本語'],
            personality: ['優しい', '創造的']
          }
        }
      }
    })
    
    console.log('テストユーザーを作成しました:', { male, female })
  } catch (error) {
    console.error('シード実行エラー:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
