import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// おすすめユーザーを取得するAPI
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }
    
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    
    // 基本パラメータを安全に取得
    const area = searchParams.get('area') || '';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 20;
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;
    const skip = (page - 1) * limit;
    
    // ソートオプション
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 詳細検索パラメータを安全に取得
    const keyword = searchParams.get('keyword') || '';
    const ignoreAge = searchParams.get('ignoreAge') === 'true';
    const ignoreHeight = searchParams.get('ignoreHeight') === 'true';
    const ignorePhotoVideo = searchParams.get('ignorePhotoVideo') === 'true';
    const ignoreDrinking = searchParams.get('ignoreDrinking') === 'true';
    const ignoreSmoking = searchParams.get('ignoreSmoking') === 'true';
    const ignoreGender = searchParams.get('ignoreGender') === 'true';
    
    // 数値型パラメータを安全に処理
    let minAge: number | undefined = undefined;
    let maxAge: number | undefined = undefined;
    let minHeight: number | undefined = undefined;
    let maxHeight: number | undefined = undefined;
    
    if (!ignoreAge) {
      const minAgeParam = searchParams.get('minAge');
      const maxAgeParam = searchParams.get('maxAge');
      
      minAge = minAgeParam ? parseInt(minAgeParam) || undefined : undefined;
      maxAge = maxAgeParam ? parseInt(maxAgeParam) || undefined : undefined;
    }
    
    if (!ignoreHeight) {
      const minHeightParam = searchParams.get('minHeight');
      const maxHeightParam = searchParams.get('maxHeight');
      
      minHeight = minHeightParam ? parseInt(minHeightParam) || undefined : undefined;
      maxHeight = maxHeightParam ? parseInt(maxHeightParam) || undefined : undefined;
    }
    
    const hasPhoto = !ignorePhotoVideo && searchParams.get('hasPhoto') === 'true';
    const hasVideo = !ignorePhotoVideo && searchParams.get('hasVideo') === 'true';
    const drinking = !ignoreDrinking ? searchParams.get('drinking') || undefined : undefined;
    const smoking = !ignoreSmoking ? searchParams.get('smoking') || undefined : undefined;
    const gender = !ignoreGender ? searchParams.get('gender') || undefined : undefined;
    const job = searchParams.get('job') || undefined;
    
    // ログ出力
    console.log('検索クエリパラメータ:', {
      keyword,
      area,
      minAge,
      maxAge,
      minHeight,
      maxHeight,
      hasPhoto,
      hasVideo,
      ignorePhotoVideo,
      drinking,
      smoking,
      gender,
      job
    });
    
    // ユーザーIDを取得
    const userId = session.user.id;
    
    // 開発モード判定
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log('現在の環境モード:', process.env.NODE_ENV, '開発モード:', isDevelopment);
    
    // 年齢フィルタのための日付計算
    const currentDate = new Date();
    
    // 安全に日付を計算（ガードつき）
    let minBirthdate: Date | undefined = undefined;
    let maxBirthdate: Date | undefined = undefined;
    
    if (typeof minAge === 'number' && !isNaN(minAge)) {
      minBirthdate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
    }
    
    if (typeof maxAge === 'number' && !isNaN(maxAge)) {
      maxBirthdate = new Date(currentDate.getFullYear() - maxAge, currentDate.getMonth(), currentDate.getDate());
    }
    
    // クエリ条件を構築
    const where: any = {};
    
    // 開発環境以外では自分自身を除外
    if (!isDevelopment) {
      where.id = { not: userId };
    }
    
    // エリア検索
    if (area) {
      where.location = { contains: area };
    }
    
    // キーワード検索
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { bio: { contains: keyword } },
        { selfIntroduction: { contains: keyword } },
        { job: { contains: keyword } },
        { 
          appealTags: {
            some: {
              appealTag: {
                name: { contains: keyword }
              }
            }
          }
        }
      ];
    }
    
    // 年齢検索
    if (minBirthdate && maxBirthdate) {
      where.birthdate = { 
        lte: minBirthdate,
        gte: maxBirthdate
      };
    } else if (minBirthdate) {
      where.birthdate = { lte: minBirthdate };
    } else if (maxBirthdate) {
      where.birthdate = { gte: maxBirthdate };
    }
    
    // 身長検索
    if (typeof minHeight === 'number' && !isNaN(minHeight)) {
      where.height = { ...(where.height || {}), gte: minHeight };
    }
    
    if (typeof maxHeight === 'number' && !isNaN(maxHeight)) {
      where.height = { ...(where.height || {}), lte: maxHeight };
    }
    
    // その他の条件
    if (drinking) where.drinking = drinking;
    if (smoking) where.smoking = smoking;
    if (gender) where.gender = gender;
    if (job) where.job = { contains: job };
    
    // 写真検索
    if (hasPhoto) {
      where.photos = { ...(where.photos || {}), some: { ...(where.photos?.some || {}), type: 'image' } };
    }
    
    // 動画検索
    if (hasVideo) {
      // 既存の写真条件があれば OR 条件を追加、なければ単独条件を設定
      if (where.photos && where.photos.some) {
        where.photos = {
          some: {
            OR: [
              where.photos.some,
              { type: 'video' }
            ]
          }
        };
      } else {
        where.photos = { some: { type: 'video' } };
      }
    }
    
    // include 定義
    const include = {
      photos: {
        select: {
          id: true,
          url: true,
          isMain: true,
          type: true,
          thumbnailUrl: true
        }
      },
      appealTags: {
        include: {
          appealTag: true
        }
      }
    };
    
    // ユーザーデータ取得
    console.log('最終的なクエリ条件:', JSON.stringify(where, null, 2));
    
    const users = await prisma.user.findMany({
      where,
      include,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      }
    });
    
    // 検索結果のログ
    console.log(`検索結果: ${users.length}件のユーザーが見つかりました`);
    console.log('動画を持つユーザー:', users.filter(user => 
      user.photos.some(photo => photo.type === 'video')
    ).map(u => u.name));
    
    // 総ユーザー数取得（ページネーション用）
    const totalUsers = await prisma.user.count({
      where
    });
    
    // レスポンス用にデータを整形
    const formattedUsers = await Promise.all(users.map(async user => {
      const birthdate = user.birthdate ? new Date(user.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : null;
      
      // メイン画像を取得
      const mainPhoto = user.photos.find(photo => photo.isMain && photo.type === 'image')?.url || 
                        user.photos.find(photo => photo.type === 'image')?.url ||
                        null;
      
      // 動画の情報を取得
      const hasVideo = user.photos.some(photo => photo.type === 'video');
      let videoUrl = null;
      let videoThumbnailUrl = null;
      
      if (hasVideo) {
        // 動画情報を取得
        const videoPhoto = user.photos.find(photo => photo.type === 'video');
        if (videoPhoto) {
          videoUrl = videoPhoto.url;
          videoThumbnailUrl = videoPhoto.thumbnailUrl;
          
          console.log(`ユーザー ${user.name} の動画情報:`, { 
            url: videoUrl, 
            thumbnailUrl: videoThumbnailUrl 
          });
        }
      }
      
      const appealTagNames = user.appealTags.map(tag => tag.appealTag.name);

      return {
        id: user.id,
        name: user.name,
        age,
        location: user.location,
        mainPhoto,
        bio: user.bio,
        hasVideo,
        videoUrl,
        videoThumbnailUrl,
        appealTags: appealTagNames,
        tags: appealTagNames // タグ名を直接tagsにも設定
      };
    }));
    
    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
    
  } catch (error) {
    console.error('おすすめユーザー取得エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
