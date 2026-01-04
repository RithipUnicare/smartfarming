import { ROLE_BUYER } from './constants';

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const parseRoles = (rolesString: string | null): string[] => {
  if (!rolesString || rolesString.trim() === '') {
    return [ROLE_BUYER]; // Default to BUYER
  }
  return rolesString.split(',').map(role => role.trim());
};

export const hasRole = (userRoles: string | null, role: string): boolean => {
  const roles = parseRoles(userRoles);
  return roles.includes(role);
};

export const isSingleRole = (userRoles: string | null): boolean => {
  const roles = parseRoles(userRoles);
  return roles.length === 1;
};

export const getPrimaryRole = (userRoles: string | null): string => {
  const roles = parseRoles(userRoles);
  return roles[0];
};
