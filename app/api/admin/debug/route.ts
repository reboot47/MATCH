import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV || '未設定',
        databaseUrl: maskDatabaseUrl(process.env.DATABASE_URL || '未設定'),
      },
      database: {
        messageCount: {
          raw: null,
          orm: null
        },
        userCount: null,
        matchCount: null,
        messageSchema: [],
        latestMessage: null
      }
    };
    
    // テーブル存在確認
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Message'
      );
    `;
    debugInfo.database.tableExists = tableExists[0].exists;
    
    // テーブル構造
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Message';
    `;
    debugInfo.database.messageSchema = columns.map(col => ({
      name: col.column_name,
      type: col.data_type
    }));
    
    // 行数カウント - SQL Raw
    const rowCountRaw = await prisma.$queryRaw`SELECT COUNT(*) AS count FROM "Message";`;
    // BigIntを文字列に変換して処理
    debugInfo.database.messageCount.raw = Number(rowCountRaw[0].count);
    
    // 行数カウント - ORM
    debugInfo.database.messageCount.orm = await prisma.message.count();
    
    // ユーザー数
    debugInfo.database.userCount = await prisma.user.count();
    
    // マッチ数
    debugInfo.database.matchCount = await prisma.match.count();
    
    // 最新のメッセージ
    const latestMessages = await prisma.message.findMany({
      take: 1,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (latestMessages.length > 0) {
      debugInfo.database.latestMessage = latestMessages[0];
    }
    
    // 全メッセージのリストも取得
    const allMessageIds = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    debugInfo.database.allMessageIds = allMessageIds;
    
    await prisma.$disconnect();
    
    // BigIntをJSON変換できるようにレスポンスを整形
    const sanitizedResponse = {
      status: '🟢 成功',
      message: 'デバッグ情報を取得しました',
      data: JSON.parse(JSON.stringify(debugInfo, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
      ))
    };
    
    return NextResponse.json(sanitizedResponse);
    
  } catch (error) {
    console.error('❌ API実行エラー:', error);
    
    await prisma.$disconnect();
    return NextResponse.json({
      status: '🔴 エラー',
      message: `デバッグ情報取得中にエラーが発生しました: ${error.message}`,
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

// データベースURLをマスク処理する関数
function maskDatabaseUrl(url) {
  if (!url || url === '未設定') return url;
  
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}`;
  } catch (error) {
    return 'Invalid URL format';
  }
}
