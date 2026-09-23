export interface AuthUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName?: string;
  role?: 'admin' | 'user' | 'employee';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
