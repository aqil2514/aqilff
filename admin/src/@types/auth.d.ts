export interface User {
  id: string;
  aud: string;
  role: string;
  full_name: string;
  nick_name: string;
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
    nick_name:string;
    full_name:string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}
