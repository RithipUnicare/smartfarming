import api from './api';
import {
  Crop,
  CropCreateRequest,
  CropRecommendationRequest,
  CropRecommendationResponse,
} from '../types/crop.types';

export const CropService = {
  createCrop: async (data: CropCreateRequest): Promise<Crop> => {
    const response = await api.post<Crop>('/crops', data);
    return response.data;
  },

  uploadCropImage: async (cropId: number, imageUri: string): Promise<any> => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `crop_${cropId}.jpg`,
    } as any);

    const response = await api.post(`/crops/${cropId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyCrops: async (): Promise<Crop[]> => {
    const response = await api.get<Crop[]>('/crops/my');
    return response.data;
  },

  getApprovedCrops: async (): Promise<Crop[]> => {
    const response = await api.get<Crop[]>('/crops/approved');
    return response.data;
  },

  getCropRecommendation: async (
    data: CropRecommendationRequest,
  ): Promise<CropRecommendationResponse> => {
    const response = await api.post<CropRecommendationResponse>(
      '/recommendation',
      data,
    );
    return response.data;
  },
};
