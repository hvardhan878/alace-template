import axios from 'axios';
import { DataPoint } from './types';

export const fetchChartData = async (): Promise<DataPoint[]> => {
  const response = await axios.get('/data');
  return response.data;
};