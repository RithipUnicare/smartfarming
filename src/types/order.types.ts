import { BuyerProfile } from './user.types';
import { Crop } from './crop.types';

export interface Order {
  id: number;
  buyer: BuyerProfile;
  crop: Crop;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string; // ISO date-time
}

export interface OrderCreateRequest {
  cropId: number;
  quantity: number;
}
