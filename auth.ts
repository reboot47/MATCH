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

// セッション診断ユーティリティ
export const diagnostics = {
  // セッション診断情報を返す
  getSessionInfo: (session: any, token: any = null) => {
    return {
      sessionExists: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id || null,
      email: session?.user?.email || null,
      name: session?.user?.name || null,
      role: session?.user?.role || null,
      tokenInfo: token ? {
        sub: token?.sub || null,
        jti: token?.jti || null,
        iat: token?.iat ? new Date(token.iat * 1000).toISOString() : null,
        exp: token?.exp ? new Date(token.exp * 1000).toISOString() : null,
        hasRole: !!token?.role,
      } : null,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };
  },
  
  // セッションエラーを分析
  analyzeSessionError: (error: any) => {
    const errorInfo = {
      name: error?.name || 'UnknownError',
      message: error?.message || 'No error message available',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : null,
      type: 'unknown',
      recommendation: '',
    };
    
    // エラータイプの特定
    if (error?.message?.includes('fetch')) {
      errorInfo.type = 'CLIENT_FETCH_ERROR';
      errorInfo.recommendation = 'Check NEXTAUTH_URL and NEXTAUTH_URL_INTERNAL environment variables';
    } else if (error?.message?.includes('JWT')) {
      errorInfo.type = 'JWT_ERROR';
      errorInfo.recommendation = 'JWT may be expired or invalid. Try clearing cookies and signing in again';
    } else if (error?.message?.includes('CSRF')) {
      errorInfo.type = 'CSRF_ERROR';
      errorInfo.recommendation = 'Ensure the request includes the correct CSRF token';
    } else if (error?.message?.includes('database')) {
      errorInfo.type = 'DATABASE_ERROR';
      errorInfo.recommendation = 'Check database connection and credentials';
    }
    
    return errorInfo;
  }
};

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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || '新規ユーザー様',
          email: profile.email,
          role: 'user',
          provider: 'google'
        }
      },
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
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
        
        const isPasswordValid = credentials.password ? hashPassword(credentials.password as string) === user.hashedPassword : false;
        
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
    async redirect() {
      // 全てのリダイレクトをマイページに固定
      return '/mypage';
    },

    async jwt({ token, user, account, profile }) {
      // ユーザーがサインインしたとき
      if (user) {
        console.log('JWTコールバック: ユーザー情報をトークンに追加', { user });
        // タイプエラーを修正
        const newToken = {
          ...token,
          id: user.id,
          role: (user as any).role || 'user',
          provider: account?.provider,
        };
        return newToken;
      }
      
      // Googleプロバイダの場合は特別な処理
      if (account && account.provider === 'google' && profile) {
        console.log('Google認証情報が入力されました', { profile });
        // トークンにGoogle情報を追加
        const googleToken = {
          ...token,
          id: profile.sub || "",
          name: profile.name,
          email: profile.email,
          role: 'user',
          provider: 'google',
        };
        return googleToken;
      }
      
      // すでにトークンが存在する場合はそのまま使用
      return token;
    },
    
    async session({ session, token }) {
      console.log('セッションコールバック', { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          provider: token.provider as string || "",
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/login",
    newUser: "/mypage"
  },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV !== "development"
      }
    }
  }
});
