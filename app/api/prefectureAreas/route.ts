import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // アプリケーションルートからの相対パスでJSONファイルを読み込む
    const filePath = path.join(process.cwd(), 'app/data/prefectureAreasComplete.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('エリアデータAPIエラー:', error);
    return NextResponse.json(
      { error: 'エリアデータの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
