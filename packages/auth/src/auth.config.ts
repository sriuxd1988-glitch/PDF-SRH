import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@simplifypdf/database';
import { verifyPassword } from './password';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            subscriptions: {
              where: { status: 'ACTIVE' },
              include: { plan: true },
            },
          },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await verifyPassword(user.passwordHash, String(credentials.password));
        if (!isValid) return null;

        const activeSub = user.subscriptions[0];
        const planSlug = activeSub?.plan?.slug || (user.role === 'PRO' ? 'PRO' : 'FREE');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          planSlug: planSlug,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        token.planSlug = (user as any).planSlug || 'FREE';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).planSlug = token.planSlug as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },
  session: {
    strategy: 'jwt',
  },
};
