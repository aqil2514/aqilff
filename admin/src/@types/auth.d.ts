export interface SupabaseAuthUser {
  instance_id: string;
  id: string;
  aud: string;
  role: string;
  email: string;
  encrypted_password: string;
  email_confirmed_at: string | null;
  invited_at: string | null;
  confirmation_token: string;
  confirmation_sent_at: string | null;
  recovery_token: string;
  recovery_sent_at: string | null;
  email_change_token_new: string;
  email_change: string;
  email_change_sent_at: string | null;
  last_sign_in_at: string | null;
  raw_app_meta_data: {
    provider: string;
    providers: string[];
  };
  raw_user_meta_data: {
    sub: string;
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
  is_super_admin: boolean | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  phone_confirmed_at: string | null;
  phone_change: string;
  phone_change_token: string;
  phone_change_sent_at: string | null;
  confirmed_at: string | null;
  email_change_token_current: string;
  email_change_confirm_status: number;
  banned_until: string | null;
  reauthentication_token: string;
  reauthentication_sent_at: string | null;
  is_sso_user: boolean;
  deleted_at: string | null;
  is_anonymous: boolean;
}

export interface SupabaseUser {
  id: string;
  aud: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  app_metadata: {
    provider: string;
    [key: string]: unknown;
  };
  user_metadata: {
    [key: string]: unknown;
  };
  identities: Array<unknown>;
  last_sign_in_at: string | null;
  role: string;
  updated_at: string;
}
