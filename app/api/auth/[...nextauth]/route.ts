import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { sha256 } from "js-sha256";

// パスワードをハッシュ化する関数
function hashPassword(password: string): string {
  // ソルトを追加してセキュリティを向上（実際の実装ではランダムなソルトと
  // pbkdf2などのより強力なアルゴリズムを使用することをお勧めします）
  const salt = "LINEBUZZ_SECURE_SALT";
  return sha256(password + salt);
}

// パスワードを検証する関数
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return hashPassword(plainPassword) === hashedPassword;
}

// 開発環境用の模擬ユーザーデータ
// 本番環境では実際のデータベースを使用してください
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@linebuzz.jp",
    hashedPassword: hashPassword("admin123"), // 本番では安全なパスワードを使用してください
    role: "admin"
  },
  {
    id: "2",
    name: "Test User",
    email: "test@linebuzz.jp",
    hashedPassword: hashPassword("test123"),
    role: "user"
  },
  {
    id: "3",
    name: "運営管理者",
    email: "operator@linebuzz.jp",
    hashedPassword: hashPassword("operator123"), // 本番では安全なパスワードを使用してください
    role: "operator"
  }
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "メールアドレス", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // 開発環境では模擬データを使用
        const user = mockUsers.find(u => u.email === credentials.email);

        if (!user || !user.hashedPassword) {
          throw new Error("メールアドレスかパスワードが正しくありません");
        }

        const isCorrectPassword = verifyPassword(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("メールアドレスかパスワードが正しくありません");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    adminSignIn: "/admin/login", // Add this line
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
});

// Route Handlers
export const GET = handlers.GET;
export const POST = handlers.POST;
