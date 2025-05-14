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

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}
