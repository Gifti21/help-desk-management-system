export type UserRole = 'ADMIN' | 'AGENT' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
}
