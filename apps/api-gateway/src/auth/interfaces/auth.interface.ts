export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  walletAddress?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface WalletResponse {
  userId: string;
  walletAddress: string;
  connected: boolean;
  timestamp: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RequestPasswordChangeResponse {
  message: string;
  emailSent: boolean;
}

export interface ConfirmPasswordChangeResponse {
  message: string;
  success: boolean;
}
