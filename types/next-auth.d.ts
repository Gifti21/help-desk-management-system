import { DefaultSession } from 'next-auth';
import type { UserRole } from '@/types/user';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      departmentId: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    departmentId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    departmentId: string;
  }
}
