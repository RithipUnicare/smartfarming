import { FarmerProfile } from './user.types';

export interface Crop {
  id: number;
  farmer: FarmerProfile;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  harvestDate: string; // ISO date string
  imageUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CropCreateRequest {
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  harvestDate: string;
}

export interface CropRecommendationRequest {
  district: string;
  state: string;
  soilType: string;
  season: string;
}

export interface CropRecommendationResponse {
  recommendations: string[];
  [key: string]: any;
}
