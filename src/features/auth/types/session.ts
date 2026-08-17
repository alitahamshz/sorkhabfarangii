export type AuthAudience = "admin" | "customer" | "seller";

export type AuthUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  mobile: string;
  gender: string | null;
  profile_picture: string | null;
  is_personal: boolean;
  company_name: string | null;
  roles: unknown[];
  name: string;
  family: string;
  audience: AuthAudience;
};

export type AuthSession = {
  user: AuthUser;
  expires: string;
};

export type ServerAuthSession = AuthSession & {
  accessToken: string;
};
