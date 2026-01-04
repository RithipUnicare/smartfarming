export interface RoleUpdateRequest {
  mobileNumber: string;
  roles: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}
