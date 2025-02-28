import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "電話番号", type: "text" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          console.log('認証エラー: 認証情報が不足しています');
          return null;
        }

        // デバッグログ
        console.log('認証試行:', {
          phone: credentials.phone,
        });

        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: credentials.phone,
          },
        });

        // デバッグログ
        console.log('ユーザー検索結果:', {
          found: !!user,
          hasPassword: !!user?.password,
        });

        if (!user || !user.password) {
          console.log('認証エラー: ユーザーが見つからないか、パスワードが設定されていません');
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // デバッグログ
        console.log('パスワード検証:', {
          isValid: isPasswordValid,
        });

        if (!isPasswordValid) {
          console.log('認証エラー: パスワードが一致しません');
          return null;
        }

        return {
          id: user.id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // ユーザーが初めてログインした時
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber;
        token.email = user.email;
        token.image = user.image;
        token.name = user.name;
      }

      // セッション更新ハンドリング
      if (trigger === "update" && session) {
        console.log("JWT更新トリガー:", { session });
        
        // sessionからの更新があればそれを適用
        if (session.user) {
          if (session.user.email) token.email = session.user.email;
          if (session.user.name) token.name = session.user.name;
          if (session.user.image) token.image = session.user.image;
        }
      }

      // 毎回のJWT生成時に最新のユーザー情報を取得
      if (token.id) {
        try {
          const updatedUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              phoneNumber: true,
              email: true,
              name: true,
              image: true,
            },
          });

          if (updatedUser) {
            // 常に最新のデータで更新
            token.phoneNumber = updatedUser.phoneNumber;
            token.email = updatedUser.email;
            token.name = updatedUser.name;
            token.image = updatedUser.image;
            
            console.log("JWT更新完了:", { 
              email: token.email,
              name: token.name,
              phoneNumber: token.phoneNumber
            });
          }
        } catch (error) {
          console.error("JWT更新エラー:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.email = token.email as string || null;
        session.user.image = token.image as string || null;
      }
      return session;
    },
  },
  domain: process.env.DOMAIN,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
