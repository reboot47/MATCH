import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// プロフィール情報の取得
export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const { userId } = context.params;
    
    // ユーザーIDのチェック
    if (session.user.id !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    // ユーザー情報の取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        photos: true,
        appealTags: {
          include: {
            appealTag: true,
          },
        },
      },
    });
    
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'ユーザーが見つかりません' }), {
        status: 404,
      });
    }
    
    // パスワードなど機密情報を削除
    const { password, ...userWithoutPassword } = user;
    
    // 詳細プロフィール情報を整形して返す
    const userProfileData = {
      ...userWithoutPassword,
      languages: user.languages || [],
      interests: user.interests || [],
    };
    
    return NextResponse.json(userProfileData);
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    console.error('詳細なエラー:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}

// プロフィール情報の更新
export async function PUT(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const { userId } = context.params;
    
    // ユーザーIDのチェック
    if (session.user.id !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    console.log('受信したデータ:', JSON.stringify(body, null, 2));
    
    // 更新するフィールドの抽出
    const {
      name,
      bio,
      location,
      gender,
      birthdate,
      height,
      job,
      education,
      income,
      purpose,
      selfIntroduction,
      appealTags,
      drinking,
      smoking,
      childrenPlan,
      marriageIntention,
      languages,
      interests,
      ...otherFields
    } = body;
    
    // 更新するデータのオブジェクト作成
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (gender !== undefined) updateData.gender = gender;
    if (birthdate !== undefined) updateData.birthdate = birthdate;
    if (height !== undefined) updateData.height = height;
    if (job !== undefined) updateData.job = job;
    if (education !== undefined) updateData.education = education;
    if (income !== undefined) updateData.income = income;
    if (purpose !== undefined) updateData.purpose = purpose;
    if (selfIntroduction !== undefined) updateData.selfIntroduction = selfIntroduction;
    if (drinking !== undefined) updateData.drinking = drinking;
    if (smoking !== undefined) updateData.smoking = smoking;
    if (childrenPlan !== undefined) updateData.childrenPlan = childrenPlan;
    if (marriageIntention !== undefined) updateData.marriageIntention = marriageIntention;
    if (languages !== undefined) {
      // 配列を確実に渡す
      updateData.languages = Array.isArray(languages) ? languages : [];
    }
    if (interests !== undefined) {
      // 配列を確実に渡す
      updateData.interests = Array.isArray(interests) ? interests : [];
    }
    
    // ユーザー情報の更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    
    // アピールタグの更新
    if (appealTags !== undefined) {
      // まず現在のタグを削除
      await prisma.userAppealTag.deleteMany({
        where: { userId }
      });
      
      // 新しいタグを処理
      if (Array.isArray(appealTags) && appealTags.length > 0) {
        for (const tagName of appealTags) {
          // タグを取得または作成
          let appealTag = await prisma.appealTag.findFirst({
            where: { name: tagName }
          });
          
          if (!appealTag) {
            appealTag = await prisma.appealTag.create({
              data: { name: tagName }
            });
          }
          
          // ユーザーとタグの関連付け
          await prisma.userAppealTag.create({
            data: {
              userId,
              tagId: appealTag.id
            }
          });
        }
      }
    }
    
    // パスワードなど機密情報を削除
    const { password, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    console.error('詳細なエラー:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}
