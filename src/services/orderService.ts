import api from './api';
import { Order, OrderCreateRequest } from '../types/order.types';

export const OrderService = {
  placeOrder: async (data: OrderCreateRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/my');
    return response.data;
  },
};
