import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DataPoint } from '../types';

interface Props {
  data: DataPoint[];
  isLoading: boolean;
  error: string | null;
}

export const SalesChart: React.FC<Props> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            name="Sales"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};