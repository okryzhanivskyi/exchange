export interface JwtPayload {
  email: string;
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AccessTokenResponse {
  accessToken: string;
}
