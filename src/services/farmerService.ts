import api from './api';
import { FarmerProfile, FarmerProfileRequest } from '../types/user.types';

export const FarmerService = {
  getFarmerProfile: async (): Promise<FarmerProfile> => {
    const response = await api.get<FarmerProfile>('/farmer/profile');
    return response.data;
  },

  saveFarmerProfile: async (
    data: FarmerProfileRequest,
  ): Promise<FarmerProfile> => {
    const response = await api.post<FarmerProfile>('/farmer/profile', data);
    return response.data;
  },
};
