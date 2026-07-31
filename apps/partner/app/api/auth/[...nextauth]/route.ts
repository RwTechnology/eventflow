import NextAuth from 'next-auth';
import { authOptions } from '../../../../auth-options';

// api/auth/[...nextauth]/route.ts — écrit à la main.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
