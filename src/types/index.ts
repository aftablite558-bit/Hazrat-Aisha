export type UserRole = "admin" | "principal" | "teacher" | "student";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: number;
  isEmailVerified: boolean;
}
