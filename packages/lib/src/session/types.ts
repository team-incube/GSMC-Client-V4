export type UserRole = "UNAUTHORIZED" | "STUDENT" | "TEACHER" | "ROOT" | "HOMEROOM_TEACHER";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  role: UserRole;
};

export type AuthorizationUrl = {
  url: string;
  state: string;
};

export type SigninInput = {
  code: string;
  state: string;
  redirectUri: string;
};
