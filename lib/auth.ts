import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import type { UserRole } from "@/types/user";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('[AUTH] authorize() called');
        console.log('[AUTH] Email:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { department: true }
        });

        console.log('[AUTH] User found:', !!user);

        if (!user) {
          console.log('[AUTH] User not found in database');
          return null;
        }

        if (!user.isActive) {
          console.log('[AUTH] User is not active');
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        console.log('[AUTH] Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          return null;
        }

        console.log('[AUTH] Login successful for:', user.email);
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role as UserRole,
          departmentId: user.departmentId
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.departmentId = user.departmentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.departmentId = token.departmentId as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
