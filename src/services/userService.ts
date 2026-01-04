import api from './api';
import { User, UserEditRequest } from '../types/user.types';

export const UserService = {
  getMyProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  editUser: async (data: UserEditRequest): Promise<any> => {
    const response = await api.put('/users/edit', data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  deleteUser: async (id: number): Promise<any> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
