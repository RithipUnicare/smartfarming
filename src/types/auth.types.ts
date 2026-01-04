export interface LoginRequest {
  mobileNumber: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
}
