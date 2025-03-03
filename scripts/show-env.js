// show-env.js
// 注意：このスクリプトはデバッグ専用で、本番環境では使用しないでください
// DATABASE_URLの一部を表示して接続先を確認する

require('dotenv').config();

function maskSensitiveInfo(url) {
  if (!url) return 'DATABASE_URL not found';
  
  try {
    // URLをパースして安全な形式で表示
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}`;
  } catch (error) {
    return 'Invalid URL format';
  }
}

// 使用中のデータベースURLを安全に表示（パスワードはマスク）
console.log('Using DATABASE_URL:', maskSensitiveInfo(process.env.DATABASE_URL));
