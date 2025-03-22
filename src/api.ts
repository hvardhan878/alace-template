import axios from 'axios';
import { Item, ItemInput } from './types';

const API_URL = '/api/items';

export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await axios.get(API_URL);
    // Ensure the response data is an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return []; // Return empty array on error
  }
};

export const fetchItem = async (id: number): Promise<Item> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createItem = async (item: ItemInput): Promise<Item> => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const updateItem = async (id: number, item: ItemInput): Promise<Item> => {
  const response = await axios.put(`${API_URL}/${id}`, item);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};