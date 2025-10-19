import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";

// Placeholder user store for demo; replace with DB lookup using Drizzle
const demoUser = {
  id: "demo-user-1",
  email: "demo@cognicash.app",
  name: "Demo User",
  passwordHash: "$2a$10$u2m3r2k98E6Fv3m5x4X0Ke6x4y8J5Pq0s0bYxQHqk5qE3n3bqZbCO" // hash for "password123"
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email.toLowerCase() !== demoUser.email) return null;
        const ok = await compare(credentials.password, demoUser.passwordHash);
        if (!ok) return null;
        return { id: demoUser.id, email: demoUser.email, name: demoUser.name };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user.id = token.uid as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
