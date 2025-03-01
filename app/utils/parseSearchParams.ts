/**
 * 検索パラメータをPrismaのクエリ条件に変換するユーティリティ関数
 * @param searchParams URLSearchParamsオブジェクト
 * @returns Prismaクエリに使用できる条件オブジェクト
 */
export function parseSearchParams(searchParams: URLSearchParams): any {
  const whereConditions: any = {};

  // 性別フィルター
  const gender = searchParams.get('gender');
  if (gender && gender !== 'any') {
    whereConditions.gender = gender;
  }

  // 年齢範囲フィルター
  const minAge = searchParams.get('minAge');
  const maxAge = searchParams.get('maxAge');
  const ignoreAge = searchParams.get('ignoreAge') === 'true';

  if (!ignoreAge && (minAge || maxAge)) {
    whereConditions.age = {};
    if (minAge && !isNaN(parseInt(minAge))) {
      whereConditions.age.gte = parseInt(minAge);
    }
    if (maxAge && !isNaN(parseInt(maxAge))) {
      whereConditions.age.lte = parseInt(maxAge);
    }
    // 条件が空の場合は削除
    if (Object.keys(whereConditions.age).length === 0) {
      delete whereConditions.age;
    }
  }

  // 身長範囲フィルター
  const minHeight = searchParams.get('minHeight');
  const maxHeight = searchParams.get('maxHeight');
  const ignoreHeight = searchParams.get('ignoreHeight') === 'true';

  if (!ignoreHeight && (minHeight || maxHeight)) {
    whereConditions.height = {};
    if (minHeight && !isNaN(parseInt(minHeight))) {
      whereConditions.height.gte = parseInt(minHeight);
    }
    if (maxHeight && !isNaN(parseInt(maxHeight))) {
      whereConditions.height.lte = parseInt(maxHeight);
    }
    // 条件が空の場合は削除
    if (Object.keys(whereConditions.height).length === 0) {
      delete whereConditions.height;
    }
  }

  // 職業フィルター
  const job = searchParams.get('job');
  if (job && job !== 'any') {
    whereConditions.job = job;
  }

  // 飲酒フィルター
  const drinking = searchParams.get('drinking');
  const ignoreDrinking = searchParams.get('ignoreDrinking') === 'true';
  if (!ignoreDrinking && drinking && drinking !== 'any') {
    whereConditions.drinking = drinking;
  }

  // 喫煙フィルター
  const smoking = searchParams.get('smoking');
  const ignoreSmoking = searchParams.get('ignoreSmoking') === 'true';
  if (!ignoreSmoking && smoking && smoking !== 'any') {
    whereConditions.smoking = smoking;
  }

  // エリアフィルター
  const area = searchParams.get('area');
  if (area && area !== 'all') {
    whereConditions.location = { contains: area };
  }

  // 写真・動画フィルター
  const hasPhoto = searchParams.get('hasPhoto');
  const hasVideo = searchParams.get('hasVideo');
  const ignorePhotoVideo = searchParams.get('ignorePhotoVideo') === 'true';

  if (!ignorePhotoVideo) {
    if (hasPhoto === 'true') {
      whereConditions.photos = {
        some: {} // 少なくとも1つ写真があること
      };
    }
    if (hasVideo === 'true') {
      whereConditions.photos = {
        some: {
          type: 'video'
        }
      };
    }
  }

  return whereConditions;
}
