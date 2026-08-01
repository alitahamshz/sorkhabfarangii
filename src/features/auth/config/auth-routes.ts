export const AUTH_ROUTES = {
  customer: {
    login: "/auth/customer/login",
    otp: "/auth/customer/otp",
    destination: "/account",
  },
  admin: {
    login: "/auth/admin/login",
    otp: "/auth/admin/otp",
    destination: "/admin",
  },
  seller: {
    login: "/auth/seller/login",
    otp: "/auth/seller/otp",
    destination: "/seller",
  },
} as const;

export type AuthAudience = keyof typeof AUTH_ROUTES;
