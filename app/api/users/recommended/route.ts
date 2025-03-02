import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const currentUserId = session.user.id;
    
    // 現在のユーザーの情報を取得
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { 
        id: true,
        gender: true,
        age: true,
        location: true,
        interests: true
      }
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "ユーザー情報が見つかりません" },
        { status: 404 }
      );
    }
    
    // URLからクエリパラメータを取得
    const url = new URL(req.url);
    const gender = url.searchParams.get("gender") || undefined;
    const minAge = url.searchParams.get("minAge") ? parseInt(url.searchParams.get("minAge")!) : undefined;
    const maxAge = url.searchParams.get("maxAge") ? parseInt(url.searchParams.get("maxAge")!) : undefined;
    const location = url.searchParams.get("location") || undefined;
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : 10;
    const page = url.searchParams.get("page") ? parseInt(url.searchParams.get("page")!) : 1;
    const skip = (page - 1) * limit;
    
    // 既にいいねしたユーザーIDを取得
    const likedUserIds = await prisma.like.findMany({
      where: { fromId: currentUserId },
      select: { toId: true }
    });
    
    const excludeUserIds = [currentUserId, ...likedUserIds.map(like => like.toId)];
    
    // ユーザーにマッチするユーザーを取得
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: { notIn: excludeUserIds },
        ...(gender && { gender }),
        ...(minAge && { age: { gte: minAge } }),
        ...(maxAge && { age: { lte: maxAge } }),
        ...(location && { location }),
      },
      include: {
        photos: {
          where: { isProfile: true },
          take: 1
        }
      },
      take: limit,
      skip,
    });
    
    // 最適化のためにユーザー数も取得
    const totalCount = await prisma.user.count({
      where: {
        id: { notIn: excludeUserIds },
        ...(gender && { gender }),
        ...(minAge && { age: { gte: minAge } }),
        ...(maxAge && { age: { lte: maxAge } }),
        ...(location && { location }),
      },
    });
    
    return NextResponse.json({
      users: recommendedUsers,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error("おすすめユーザー取得エラー:", error);
    return NextResponse.json(
      { error: "おすすめユーザーの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
