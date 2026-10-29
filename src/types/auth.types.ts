export type UserRole = "ADMIN" | "AUTHOR";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  message?: string;
  accessToken?: string;
  user?: AuthUser;
}