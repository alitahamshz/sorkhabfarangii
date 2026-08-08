export type AuthAudience = "admin" | "customer" | "seller";

export type AuthUser = {
  id: string;
  name: string;
  family: string;
  level: string;
  audience: AuthAudience;
};

export type AuthSession = {
  user: AuthUser;
  expires: string;
};

export type ServerAuthSession = AuthSession & {
  accessToken: string;
};
