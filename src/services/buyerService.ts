import api from './api';
import { BuyerProfile, BuyerProfileRequest } from '../types/user.types';

export const BuyerService = {
  getBuyerProfile: async (): Promise<BuyerProfile> => {
    const response = await api.get<BuyerProfile>('/buyer/profile');
    return response.data;
  },

  saveBuyerProfile: async (
    data: BuyerProfileRequest,
  ): Promise<BuyerProfile> => {
    const response = await api.post<BuyerProfile>('/buyer/profile', data);
    return response.data;
  },
};
