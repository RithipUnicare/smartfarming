export interface User {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  roles: string | null; // Comma-separated: "FARMER,BUYER", null defaults to BUYER
  password?: string;
}

export interface FarmerProfile {
  id: number;
  user: User;
  address: string;
  district: string;
  state: string;
  landSize: number;
  soilType: string;
}

export interface BuyerProfile {
  id: number;
  user: User;
  address: string;
}

export interface FarmerProfileRequest {
  address: string;
  district: string;
  state: string;
  landSize: number;
  soilType: string;
}

export interface BuyerProfileRequest {
  address: string;
}

export interface UserEditRequest {
  mobileNumber: string;
  name: string;
}
