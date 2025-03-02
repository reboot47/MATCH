import { sha256 } from 'js-sha256';

/**
 * パスワードをハッシュ化する関数
 * 注: 本番環境では、より強力なアルゴリズム（pbkdf2, Argon2など）と
 * ランダムなソルトを使用することを強く推奨します。
 */
export function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT || 'LINEBUZZ_SECURE_SALT';
  return sha256(password + salt);
}

/**
 * パスワードを検証する関数
 */
export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return hashPassword(plainPassword) === hashedPassword;
}
