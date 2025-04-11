import { apiRequest } from './queryClient';
import { User } from '@shared/schema';

// API functions for working with users

export async function fetchUsers(): Promise<User[]> {
  const response = await apiRequest('GET', '/api/users', undefined);
  const data = await response.json();
  return data.data;
}

export async function fetchUser(id: number): Promise<User> {
  const response = await apiRequest('GET', `/api/users/${id}`, undefined);
  const data = await response.json();
  return data.data;
}

export async function createUser(user: { name: string; email: string }): Promise<User> {
  const response = await apiRequest('POST', '/api/users', user);
  const data = await response.json();
  return data.data;
}

export async function updateUser(id: number, user: { name: string; email: string }): Promise<User> {
  const response = await apiRequest('PUT', `/api/users/${id}`, user);
  const data = await response.json();
  return data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiRequest('DELETE', `/api/users/${id}`, undefined);
}
