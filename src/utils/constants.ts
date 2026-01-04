export const API_BASE_URL =
  'http://app.undefineddevelopers.online/smartfarming/api';

export const STATES_LIST = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const SOIL_TYPES = [
  { label: 'Sandy', value: 'Sandy' },
  { label: 'Loamy', value: 'Loamy' },
  { label: 'Clay', value: 'Clay' },
  { label: 'Silt', value: 'Silt' },
  { label: 'Peat', value: 'Peat' },
  { label: 'Chalky', value: 'Chalky' },
];

export const SEASONS = [
  { label: 'Kharif (Monsoon)', value: 'Kharif' },
  { label: 'Rabi (Winter)', value: 'Rabi' },
  { label: 'Zaid (Summer)', value: 'Zaid' },
];

export const ROLE_FARMER = 'FARMER';
export const ROLE_BUYER = 'BUYER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_SUPERADMIN = 'SUPERADMIN';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: '@smartfarming_token',
  REFRESH_TOKEN: '@smartfarming_refresh_token',
  USER: '@smartfarming_user',
};
