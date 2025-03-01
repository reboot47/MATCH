import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // クエリパラメーターを取得
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'received'; // received, sent
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // ユーザーID取得
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // メッセージの取得条件設定
    const whereCondition = type === 'sent'
      ? { senderId: currentUser.id }  // 送信メッセージ
      : { receiverId: currentUser.id };  // 受信メッセージ

    // メッセージを取得
    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: whereCondition,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              photos: {
                select: {
                  url: true,
                  isMain: true
                },
                orderBy: { order: 'asc' }
              }
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              photos: {
                select: {
                  url: true,
                  isMain: true
                },
                orderBy: { order: 'asc' }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.message.count({
        where: whereCondition
      })
    ]);

    // ページネーション情報
    const pagination = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };

    // メッセージデータのフォーマットを整える
    const formattedMessages = messages.map(message => {
      const partner = type === 'sent' ? message.receiver : message.sender;
      const partnerPhoto = partner.photos.find(photo => photo.isMain)?.url || 
                         (partner.photos.length > 0 ? partner.photos[0].url : null);

      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        partner: {
          id: partner.id,
          name: partner.name,
          photo: partnerPhoto
        }
      };
    });

    return NextResponse.json({ 
      messages: formattedMessages, 
      pagination 
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'メッセージの取得中にエラーが発生しました。もう一度お試しください。' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // リクエストボディを取得
    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // 送信者情報の取得
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!sender) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 受信者の存在確認
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true }
    });

    if (!receiver) {
      return NextResponse.json({ error: '受信者が見つかりません' }, { status: 404 });
    }

    // メッセージを作成
    const message = await prisma.message.create({
      data: {
        content,
        sender: { connect: { id: sender.id } },
        receiver: { connect: { id: receiverId } },
        read: false
      }
    });

    return NextResponse.json({ 
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read
      }
    });
  } catch (error) {
    console.error('Send message API error:', error);
    return NextResponse.json(
      { error: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。' },
      { status: 500 }
    );
  }
}
