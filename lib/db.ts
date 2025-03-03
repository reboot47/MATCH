import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルインスタンスを確保します
// 開発環境では不要な複数インスタンスの作成を防止します
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// APIルート互換性のため、dbとしても再エクスポート
export const db = prisma;

// 開発環境でない場合、グローバルに設定しておきます
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
