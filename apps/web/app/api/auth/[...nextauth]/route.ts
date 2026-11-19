import { authConfig } from '@simplifypdf/auth';
import NextAuth from 'next-auth';

const { handlers } = NextAuth(authConfig as any);

export const { GET, POST } = handlers;
