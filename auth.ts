import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { JWT } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from 'js-sha256';

// パスワードハッシュ関数
function hashPassword(password: string): string {
  const salt = "LINEBUZZ_SECURE_SALT";
  return sha256(password + salt);
}

// モックユーザーデータ
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@linebuzz.jp",
    hashedPassword: hashPassword("admin123"),
    role: "ADMIN"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@linebuzz.com",
    hashedPassword: hashPassword("password123"),
    role: "ADMIN"
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
    hashedPassword: hashPassword("operator123"),
    role: "operator"
  }
];

// Auth.js Config
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "メールアドレス", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (!user || !user.hashedPassword) {
          return null;
        }
        
        const isPasswordValid = hashPassword(credentials.password) === user.hashedPassword;
        
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ユーザーがサインインしたとき
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      
      // すでにトークンが存在する場合はモックユーザー情報をトークンに追加
      if (!token.id) {
        // デフォルトではuser IDを "1"に設定（モックデータの最初のユーザー）
        token.id = "1";
        token.role = "user";
      }
      
      return token;
    },
    
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
});
