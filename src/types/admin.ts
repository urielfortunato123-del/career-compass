export type AppRole = 'admin' | 'moderator' | 'user';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: 'free' | 'pro';
  roles: AppRole[];
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
