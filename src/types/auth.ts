export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  role: UserRole;
  created_at: string;
}
