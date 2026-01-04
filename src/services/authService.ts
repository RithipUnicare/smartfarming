import api from './api';
import {
  LoginRequest,
  SignupRequest,
  LoginResponse,
} from '../types/auth.types';

export const AuthService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<any> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  requestPasswordReset: async (mobileNumber: string): Promise<any> => {
    const response = await api.post('/auth/request-password-reset', {
      mobileNumber,
    });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};
