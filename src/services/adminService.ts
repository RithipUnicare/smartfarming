import api from './api';
import { RoleUpdateRequest } from '../types/api.types';

export const AdminService = {
  approveCrop: async (cropId: number): Promise<any> => {
    const response = await api.post(`/admin/approve-crop/${cropId}`);
    return response.data;
  },

  updateRole: async (data: RoleUpdateRequest): Promise<any> => {
    const response = await api.post('/admin/update-role', data);
    return response.data;
  },
};
